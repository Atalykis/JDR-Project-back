import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";

import { RoomStoreInMemory } from "../store/room.store.in-memory";
import { RoomModule } from "../room.module";
import { Room } from "../../domain/room";
import { RoomStore } from "../store/room.store";
import { UserStore } from "../../../user/infrastructure/store/user.store";
import { TokenManager } from "../../../user/application/token-manager";
import { User } from "../../../user/domain/user";

// E2E

function makeGetAuthenticatedToken(module: TestingModule) {
  const userStore = module.get<UserStore>("UserStore");
  const tokenManager = module.get<TokenManager>("TokenManager");

  return function getAuthenticatedTokenFor(username: string) {
    let user = userStore.load(username);
    if (!user) {
      user = new User(username, "password");
      userStore.register(user);
    }

    return tokenManager.generateAccessToken(user);
  };
}

describe("RoomController", () => {
  let app: INestApplication;
  let roomStore: RoomStore;

  let getAuthenticatedTokenFor: ReturnType<typeof makeGetAuthenticatedToken>;

  beforeAll(async () => {
    // Creating the module, we need to wrap the entire application so it's like hitting the production app
    const module = await Test.createTestingModule({ imports: [RoomModule] }).compile();
    // Retrieving the RoomStore, which will come in handy to assert the good behaviour of our use case
    roomStore = module.get<RoomStore>("RoomStore");
    getAuthenticatedTokenFor = makeGetAuthenticatedToken(module);

    // Create the actual http application (in the nodejs sense) so we can replicate real world interactions with our system
    app = module.createNestApplication();
    await app.init();
  });

  describe("Room creation", () => {
    it("should create a room and become an MJ", async () => {
      const token = getAuthenticatedTokenFor("Joojo");

      // Actually use our application, by making a request on the http server in our application
      const { status, text } = await request(app.getHttpServer()).post("/room").set("Authorization", token).send({ name: "testingCreationRoom" });

      // Asserting the good behaviour of the endpoint
      expect(status).toBe(HttpStatus.CREATED);
      expect(text).toBe("testingCreationRoom");

      // Asserting the good behaviour of our system
      const createdRoom = roomStore.load("testingCreationRoom");
      expect(createdRoom).toMatchObject({ name: "testingCreationRoom", mj: "Joojo" });
    });

    it("should not allow to create a room if the name is already taken", async () => {
      const token = getAuthenticatedTokenFor("Joojo");

      const room = new Room("alreadyExistingRoom", "mj");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/room").set("Authorization", token).send({ name: "alreadyExistingRoom" });

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe("Room joining", () => {
    it("should allow to join a room", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const room = new Room("testingJoinRoom", "mjjjj");
      roomStore.add(room);

      const { status, text } = await request(app.getHttpServer()).post("/join").set("Authorization", token).send({ room: "testingJoinRoom" });

      expect({ status, text }).toMatchObject({ status: HttpStatus.NO_CONTENT, text: "" });

      const joinedRoom = roomStore.load("testingJoinRoom");
      expect(joinedRoom!.members).toEqual(["Cyril"]);
    });

    it("should not allow to join a room the user is already in", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const room = new Room("alreadyJoinedRoom", "mj");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/join").set("Authorization", token).send({ room: "alreadyJoinedRoom" });

      expect(status).toBe(HttpStatus.CONFLICT);

      const joinedRoom = roomStore.load("alreadyJoinedRoom");
      expect(joinedRoom!.members).toEqual(["Cyril"]);
    });

    it("should not allow to join a non-existing room", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const { status } = await request(app.getHttpServer()).post("/join").set("Authorization", token).send({ room: "nonExistingRoom" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("Room leaving", () => {
    it("should allow an user to leave a room he's in", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const room = new Room("testingLeaveRoom", "mj");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").set("Authorization", token).send({ room: "testingLeaveRoom" });

      expect(status).toBe(HttpStatus.NO_CONTENT);

      const joinedRoom = roomStore.load("testingLeaveRoom");
      expect(joinedRoom!.members).toEqual([]);
    });

    it("should not allow an user to leave a room he's not in", async () => {
      const token = getAuthenticatedTokenFor("Cyril");
      const room = new Room("alreadyLeftRoom", "mj");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").set("Authorization", token).send({ room: "alreadyLeftRoom" });

      expect(status).toBe(HttpStatus.FORBIDDEN);

      const joinedRoom = roomStore.load("alreadyLeftRoom");
      expect(joinedRoom!.members).toEqual([]);
    });

    it("should not allow to leave a non-existing room", async () => {
      const token = getAuthenticatedTokenFor("Cyril");
      const { status } = await request(app.getHttpServer()).post("/leave").set("Authorization", token).send({ room: "nonExistingRoom" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("Room players retrieval", () => {
    async function checkPlayers(room: Room, expected: string[]) {
      const { status, body } = await request(app.getHttpServer()).get("/players").send({ room: room.name });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(expected);
    }

    it("should allow an user to retrieve the players of a room", async () => {
      const room = new Room("testingGetPlayersRoom", "mj");
      roomStore.add(room);

      await checkPlayers(room, []);

      room.join("Cyril");
      await checkPlayers(room, ["Cyril"]);

      room.join("Nico");
      await checkPlayers(room, ["Cyril", "Nico"]);
    });

    it("should not allow to retrieve the players of a non-existing room", async () => {
      const { status } = await request(app.getHttpServer()).get("/players").send({ room: "nonExistingRoom" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("Kicking a player", () => {
    it("should kick a player from a room", async () => {
      const token = getAuthenticatedTokenFor("mj");
      const room = new Room("testingKickRoom", "mj");
      room.join("Cyril");
      roomStore.add(room);

      const { status, text } = await request(app.getHttpServer())
        .post("/kick")
        .set("Authorization", token)
        .send({ room: "testingKickRoom", player: "Cyril" });

      expect(text).toBe("");
      expect(status).toBe(HttpStatus.NO_CONTENT);

      const kickedRoom = roomStore.load("testingKickRoom");
      expect(kickedRoom!.members).toEqual([]);
    });

    it("should fail if the originator of the kick is not the mj of the room", async () => {
      const token = getAuthenticatedTokenFor("notMj");
      const room = new Room("testingForbiddenKickRoom", "mj");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer())
        .post("/kick")
        .set("Authorization", token)
        .send({ room: "testingForbiddenKickRoom", player: "Cyril" });

      expect(status).toBe(HttpStatus.FORBIDDEN);

      const afterRoom = roomStore.load("testingJoinRoom");
      expect(afterRoom!.members).toEqual(["Cyril"]);
    });
  });
});
