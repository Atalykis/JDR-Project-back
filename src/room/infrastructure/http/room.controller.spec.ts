import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { RoomModule } from "../room.module";
import { Room } from "../../domain/room";
import { TokenManager } from "../../../user/application/token-manager";
import { User } from "../../../user/domain/user";
import { RoomStore } from "../../application/room.store";
import { UserStore } from "../../../user/application/user.store";
import { makeGetAuthenticatedToken } from "../../../user/test/authenticated-token";
import { CharacterIdentity } from "../../../character/domain/character";

// E2E

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
    it("should create a room and become an GM", async () => {
      const token = getAuthenticatedTokenFor("Joojo");

      // Actually use our application, by making a request on the http server in our application
      const { status, text } = await request(app.getHttpServer())
        .post("/room")
        .set("Authorization", token)
        .send({ name: "testingCreationRoom", adventure: "GreatEscape" });

      // Asserting the good behaviour of the endpoint
      expect(status).toBe(HttpStatus.CREATED);
      expect(text).toBe("testingCreationRoom");

      // Asserting the good behaviour of our system
      const createdRoom = await roomStore.load("testingCreationRoom");
      expect(createdRoom).toMatchObject({ name: "testingCreationRoom", gm: "Joojo" });
    });

    it("should not allow to create a room if the name is already taken", async () => {
      const token = getAuthenticatedTokenFor("Joojo");

      const room = new Room("alreadyExistingRoom", "gm", "GreatEscape");
      await roomStore.add(room);

      const { status } = await request(app.getHttpServer())
        .post("/room")
        .set("Authorization", token)
        .send({ name: "alreadyExistingRoom", adventure: "GreatEscape" });

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe("Room joining", () => {
    it("should allow to join a room", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const room = new Room("testingJoinRoom", "gmjjj", "GreatEscape");
      await roomStore.add(room);

      const { status, text } = await request(app.getHttpServer()).post("/join").set("Authorization", token).send({ room: "testingJoinRoom" });

      expect({ status, text }).toMatchObject({ status: HttpStatus.NO_CONTENT, text: "" });

      const joinedRoom = await roomStore.load("testingJoinRoom");
      expect(joinedRoom!.members).toEqual(["Cyril"]);
    });

    it("should not allow to join a room the user is already in", async () => {
      const token = getAuthenticatedTokenFor("Cyril");

      const room = new Room("alreadyJoinedRoom", "gm", "GreatEscape");
      room.join("Cyril");
      await roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/join").set("Authorization", token).send({ room: "alreadyJoinedRoom" });

      expect(status).toBe(HttpStatus.CONFLICT);

      const joinedRoom = await roomStore.load("alreadyJoinedRoom");
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

      const room = new Room("testingLeaveRoom", "gm", "GreatEscape");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").set("Authorization", token).send({ room: "testingLeaveRoom" });

      expect(status).toBe(HttpStatus.NO_CONTENT);

      const joinedRoom = await roomStore.load("testingLeaveRoom");
      expect(joinedRoom!.members).toEqual([]);
    });

    it("should not allow an user to leave a room he's not in", async () => {
      const token = getAuthenticatedTokenFor("Cyril");
      const room = new Room("alreadyLeftRoom", "gm", "GreatEscape");
      await roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").set("Authorization", token).send({ room: "alreadyLeftRoom" });

      expect(status).toBe(HttpStatus.FORBIDDEN);

      const joinedRoom = await roomStore.load("alreadyLeftRoom");
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
      const room = new Room("testingGetPlayersRoom", "gm", "GreatEscape");
      await roomStore.add(room);

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
      const token = getAuthenticatedTokenFor("gm");
      const room = new Room("testingKickRoom", "gm", "GreatEscape");
      room.join("Cyril");
      await roomStore.add(room);

      const { status, text } = await request(app.getHttpServer())
        .post("/kick")
        .set("Authorization", token)
        .send({ room: "testingKickRoom", player: "Cyril" });

      expect(text).toBe("");
      expect(status).toBe(HttpStatus.NO_CONTENT);

      const kickedRoom = await roomStore.load("testingKickRoom");
      expect(kickedRoom!.members).toEqual([]);
    });

    it("should fail if the originator of the kick is not the gm of the room", async () => {
      const token = getAuthenticatedTokenFor("notGm");
      const room = new Room("testingForbiddenKickRoom", "gm", "GreatEscape");
      room.join("Cyril");
      await roomStore.add(room);

      const { status } = await request(app.getHttpServer())
        .post("/kick")
        .set("Authorization", token)
        .send({ room: "testingForbiddenKickRoom", player: "Cyril" });

      expect(status).toBe(HttpStatus.FORBIDDEN);

      const afterRoom = await roomStore.load("testingJoinRoom");
      expect(afterRoom!.members).toEqual(["Cyril"]);
    });
  });
});
