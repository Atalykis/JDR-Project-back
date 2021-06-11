import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { Test } from "@nestjs/testing";
import { RoomStore } from "../../application/room.store";

import { RoomStoreInMemory } from "../room.store.in-memory";
import { RoomModule } from "../../room.module";
import { Room } from "../../domain/room";
// E2E

describe("RoomController", () => {
  let app: INestApplication;
  let roomStore: RoomStore;

  beforeAll(async () => {
    // Creating the module, we need to wrap the entire application so it's like hitting the production app
    const module = await Test.createTestingModule({ imports: [RoomModule] }).compile();
    // Retrieving the RoomStore, which will come in handy to assert the good behaviour of our use case
    roomStore = module.get<RoomStore>("RoomStore");

    // Create the actual http application (in the nodejs sense) so we can replicate real world interactions with our system
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    console.log(roomStore);
  });

  describe("Room creation", () => {
    it("should create a room", async () => {
      // Actually use our application, by making a request on the http server in our application
      const { status, text } = await request(app.getHttpServer()).post("/room").send({ name: "testingCreationRoom" });

      // Asserting the good behaviour of the endpoint
      expect(status).toBe(HttpStatus.CREATED);
      expect(text).toBe("testingCreationRoom");

      // Asserting the good behaviour of our system
      const createdRoom = roomStore.load("testingCreationRoom");
      expect(createdRoom).toMatchObject({ name: "testingCreationRoom" });
    });

    it("should not allow to create a room if the name is already taken", async () => {
      const room = new Room("alreadyExistingRoom");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/room").send({ name: "alreadyExistingRoom" });

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe("Room joining", () => {
    it("should allow to join a room", async () => {
      const room = new Room("testingJoinRoom");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/join").send({ room: "testingJoinRoom", user: "Cyril" });

      expect(status).toBe(HttpStatus.NO_CONTENT);

      const joinedRoom = roomStore.load("testingJoinRoom");
      expect(joinedRoom!.members).toEqual(["Cyril"]);
    });

    it("should not allow to join a room the user is already in", async () => {
      const room = new Room("alreadyJoinedRoom");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/join").send({ room: "alreadyJoinedRoom", user: "Cyril" });

      expect(status).toBe(HttpStatus.CONFLICT);

      const joinedRoom = roomStore.load("alreadyJoinedRoom");
      expect(joinedRoom!.members).toEqual(["Cyril"]);
    });

    it("should not allow to join a non-existing room", async () => {
      const { status } = await request(app.getHttpServer()).post("/join").send({ room: "nonExistingRoom", user: "Cyril" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("Room leaving", () => {
    it("should allow an user to leave a room he's in", async () => {
      const room = new Room("testingLeaveRoom");
      room.join("Cyril");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").send({ room: "testingLeaveRoom", user: "Cyril" });

      expect(status).toBe(HttpStatus.NO_CONTENT);

      const joinedRoom = roomStore.load("testingLeaveRoom");
      expect(joinedRoom!.members).toEqual([]);
    });

    it("should not allow an user to leave a room he's not in", async () => {
      const room = new Room("alreadyLeftRoom");
      roomStore.add(room);

      const { status } = await request(app.getHttpServer()).post("/leave").send({ room: "alreadyLeftRoom", user: "Cyril" });

      expect(status).toBe(HttpStatus.FORBIDDEN);

      const joinedRoom = roomStore.load("alreadyLeftRoom");
      expect(joinedRoom!.members).toEqual([]);
    });

    it("should not allow to leave a non-existing room", async () => {
      const { status } = await request(app.getHttpServer()).post("/leave").send({ room: "nonExistingRoom", user: "Cyril" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("Room members retrieval", () => {
    async function checkMembers(room: Room, expected: string[]) {
      const { status, body } = await request(app.getHttpServer()).get("/members").send({ room: room.name });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(expected);
    }

    it("should allow an user to retrieve the members of a room", async () => {
      const room = new Room("testingGetMembersRoom");
      roomStore.add(room);

      await checkMembers(room, []);

      room.join("Cyril");
      await checkMembers(room, ["Cyril"]);

      room.join("Nico");
      await checkMembers(room, ["Cyril", "Nico"]);
    });

    it("should not allow to retrieve the members of a non-existing room", async () => {
      const { status } = await request(app.getHttpServer()).get("/members").send({ room: "nonExistingRoom" });
      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
