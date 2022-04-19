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
      room.join("Atalykis", jojo.identity);
      room.join("Aetherall", dio.identity);
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
  });

  describe("Mutation Join Room", () => {
    const mutation = gql`
      mutation JoinRoom($room: String!, $character: CharacterInput!) {
        joinRoom(room: $room, character: $character) {
          name
          characters {
            name
          }
        }
      }
    `;

    it("should allow to join a room", async () => {
      const room = RoomFixtures.atalykisGreatRoom;
      const character = CharacterFixtures.Jojo;
      await roomStore.add(room);

      const result = await graphql.execute(mutation, {
        room: room.name,
        character: character.identity.toObject(),
      });

      const joined = await roomStore.load(room.name);

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        joinRoom: {
          name: room.name,
          characters: [{ name: "Jojo" }],
        },
      });

      expect(joined!.members).toEqual(["Atalykis"]);
      expect(joined!.adventurers).toEqual([character.identity]);
    });
  });
});
