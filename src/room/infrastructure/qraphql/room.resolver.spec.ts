import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { RoomStoreInMemory } from "../store/room.store.in-memory";
import { gql } from "apollo-server-express";
import { CharacterFixtures } from "../../../character/domain/character.builder";
import { CharacterStoreInMemory } from "../../../character/infrastructure/character.store.in-memory";
import { Room } from "../../domain/room";
import { RoomFixtures } from "../../domain/room-builder";
import { Adventure } from "../../../adventure/domain/adventure";
import { CannotCreateRoomWithAlreadyTakenNameError } from "../../application/create-room.command/create-room.command";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError } from "../../application/join-room.command/join-room.command";
import { CannotLeaveUnexistingRoomError, CannotLeaveUnjoinedRoomError } from "../../application/leave-room.command/leave-room.command";
import { CannotKickPlayerIfNotGmError } from "../../application/kick-player.command/kick-player.command";
import { CannotAddCharacterInsideNonExistingRoom } from "../../application/add-character.command/add-character.command";

// TODO Add error handling already present in the controller
describe("Room Resolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;

  const roomStore = new RoomStoreInMemory();
  const characterStore = new CharacterStoreInMemory();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("RoomStore")
      .useValue(roomStore)
      .overrideProvider("CharacterStore")
      .useValue(characterStore)
      .compile();

    app = module.createNestApplication();
    await app.init();

    graphql = new GraphqlTestClient(app);
    graphql.as("Atalykis");
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    roomStore.clear();
  });

  describe("Query Room's characters", () => {
    const GetRoomCharacters = gql`
      query GetRoomCharacters($name: String!) {
        room(name: $name) {
          characters {
            name
            owner
            adventure
            description
          }
        }
      }
    `;

    it("should return all characters in a room", async () => {
      const jojo = CharacterFixtures.Jojo;
      const dio = CharacterFixtures.Dio;
      const room = RoomFixtures.escapeRoom;

      characterStore.add(jojo);
      characterStore.add(dio);
      room.join("Atalykis");
      room.join("Aetherall");
      room.addCharacter(jojo.identity);
      room.addCharacter(dio.identity);
      await roomStore.add(room);

      const { errors, data } = await graphql.execute(GetRoomCharacters, { name: "escapeRoom" });

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        room: {
          characters: [
            { name: "Jojo", owner: "Atalykis", adventure: "TheGreatEscape", description: "Default description" },
            { name: "Dio", owner: "Aetherall", adventure: "TheGreatEscape", description: "Default description" },
          ],
        },
      });
    });
  });

  describe("Query Adventure's Rooms", () => {
    const GetAdventureRooms = gql`
      query GetAdventureRooms($adventure: String!) {
        rooms(adventure: $adventure) {
          name
          gm
          adventure
        }
      }
    `;

    it("should return all the rooms contained inside an adventure", async () => {
      const escapeRoom = RoomFixtures.escapeRoom;
      const greatRoom = RoomFixtures.greatRoom;

      await roomStore.add(escapeRoom);
      await roomStore.add(greatRoom);

      const { errors, data } = await graphql.execute(GetAdventureRooms, { adventure: "TheGreatEscape" });

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        rooms: [
          {
            name: escapeRoom.name,
            gm: escapeRoom.gm,
            adventure: escapeRoom.adventure,
          },
          {
            name: greatRoom.name,
            gm: greatRoom.gm,
            adventure: greatRoom.adventure,
          },
        ],
      });
    });
  });

  describe("Mutation Create Room", () => {
    const mutation = gql`
      mutation createRoom($name: String!, $adventure: String!) {
        createRoom(name: $name, adventure: $adventure) {
          name
          adventure
          gm
        }
      }
    `;

    it("should create a room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;

      const result = await graphql.execute(mutation, {
        name: room.name,
        adventure: room.adventure,
      });

      const created = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        createRoom: {
          name: room.name,
          gm: room.gm,
          adventure: room.adventure,
        },
      });

      expect(created).toEqual(room);
    });

    it("should not allow to create a room if name already taken", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        name: room.name,
        adventure: room.adventure,
      });
      expect(result.errors[0].message).toEqual(new CannotCreateRoomWithAlreadyTakenNameError(room.name).message);
    });
  });

  describe("Mutation Join Room", () => {
    const mutation = gql`
      mutation JoinRoom($room: String!) {
        joinRoom(room: $room) {
          name
          members
        }
      }
    `;

    it("should allow a user to join a room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
      });

      const joined = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        joinRoom: {
          name: room.name,
          members: ["Atalykis"],
        },
      });

      expect(joined!.members).toEqual(["Atalykis"]);
    });

    it("should not allow a user to join a room if already in it", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      const user = "Atalykis";
      room.join(user);
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
      });

      expect(result.errors[0].message).toEqual(new CannotJoinAleadyJoinedRoomError(user).message);
    });

    it("should not allow a user to join an unexisting room", async () => {
      const result = await graphql.execute(mutation, {
        room: "unexisting",
      });

      expect(result.errors[0].message).toEqual(new CannotJoinUnexistingRoomError("unexisting").message);
    });
  });

  describe("Mutation Leave Room", () => {
    const mutation = gql`
      mutation LeaveRoom($room: String!) {
        leaveRoom(room: $room) {
          name
          members
        }
      }
    `;

    it("should allow a user to leave a room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      room.join("Atalykis");
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
      });

      const leavedRoom = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({
        leaveRoom: {
          name: room.name,
          members: [],
        },
      });

      expect(leavedRoom!.members).toEqual([]);
    });

    it("should fail if the user is not in the room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      const user = "Atalykis";
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
      });

      expect(result.errors[0].message).toEqual(new CannotLeaveUnjoinedRoomError(user).message);
    });

    it("should fail if the room does not exist", async () => {
      const result = await graphql.execute(mutation, {
        room: "unexisting",
      });

      expect(result.errors[0].message).toEqual(new CannotLeaveUnexistingRoomError("unexisting").message);
    });
  });

  describe("Mutation Kick Player", () => {
    const mutation = gql`
      mutation KickPlayer($room: String!, $player: String!) {
        kickPlayer(room: $room, player: $player) {
          name
          members
        }
      }
    `;

    it("should allow a gm to kick a player", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      room.join("Aetherall");

      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
        player: "Aetherall",
      });

      const kickPlayerTestRoom = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({
        kickPlayer: {
          name: room.name,
          members: [],
        },
      });

      expect(kickPlayerTestRoom!.members).toEqual([]);
    });

    it("should fail if the originator is not a gm", async () => {
      const room = RoomFixtures.greatRoom;
      room.join("Aetherall");

      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
        player: "Aetherall",
      });

      expect(result.errors[0].message).toEqual(new CannotKickPlayerIfNotGmError(room.name).message);
    });
  });

  describe("Mutation Add Character", () => {
    const mutation = gql`
      mutation AddCharacter($room: String!, $character: CharacterInput!) {
        addCharacter(room: $room, character: $character) {
          name
          characters {
            name
          }
        }
      }
    `;

    it("should allow a user or gm to add a character to a room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      const jojo = CharacterFixtures.Jojo;

      await roomStore.add(room);
      await characterStore.add(jojo);

      const result = await graphql.execute(mutation, {
        room: room.name,
        character: jojo.identity,
      });

      const addCharacterTestRoom = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({
        addCharacter: {
          name: room.name,
          characters: [{ name: jojo.name }],
        },
      });

      expect(addCharacterTestRoom!.adventurers).toEqual([jojo.identity]);
    });

    it("should fail if the room does not exist", async () => {
      const result = await graphql.execute(mutation, {
        room: "unexisting",
        character: CharacterFixtures.Jojo.identity,
      });

      expect(result.errors[0].message).toEqual(new CannotAddCharacterInsideNonExistingRoom("unexisting").message);
    });
  });
});
