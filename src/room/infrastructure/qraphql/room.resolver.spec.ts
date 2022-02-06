import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client.spec";
import { RoomStoreInMemory } from "../store/room.store.in-memory";
import { gql } from "apollo-server-express";
import { CharacterFixtures } from "../../../character/domain/character.builder";
import { CharacterStoreInMemory } from "../../../character/infrastructure/character.store.in-memory";
import { Room } from "../../domain/room";
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

  describe("Query Room's characters", () => {
    const GetRoomCharacters = (name: string) => gql`
    query GetRoomCharacters {
        room(name: "${name}") {
          name
          gm
          characters {
              name
              owner
              adventure
              description
          }
        }
    }`;

    it("should return all characters in a room", async () => {
      const jojo = CharacterFixtures.Jojo.build();
      const dio = CharacterFixtures.Dio.for("Aetherall").build();
      const room = new Room("TheGreatRoom", "gm", "TheGreatEscape");

      characterStore.add(jojo);
      characterStore.add(dio);
      room.join("Atalykis", jojo.identity);
      room.join("Aetherall", dio.identity);
      roomStore.add(room);

      const { errors, data } = await graphql.execute(GetRoomCharacters("TheGreatRoom"));

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        room: {
          name: "TheGreatRoom",
          gm: "gm",
          characters: [
            { name: "Jojo", owner: "Atalykis", adventure: "TheGreatEscape", description: "Default description" },
            { name: "Dio", owner: "Aetherall", adventure: "TheGreatEscape", description: "Default description" },
          ],
        },
      });
    });
  });
});
