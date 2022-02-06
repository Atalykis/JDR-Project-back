import { CharacterFixtures } from "../../domain/character.builder";
import { CharacterStoreInMemory } from "../character.store.in-memory";
import { gql } from "apollo-server-express";
import { DocumentNode, print } from "graphql";
import { Test, TestingModule } from "@nestjs/testing";
import { BackendModule } from "../../../backend.module";
import { INestApplication } from "@nestjs/common";
import { CharacterStore } from "../../application/character.store";
import request from "supertest";
import { GraphqlTestClient } from "../../../test/graphql.test-client.spec";

describe("Character Resolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;

  const characterStore = new CharacterStoreInMemory();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("CharacterStore")
      .useValue(characterStore)
      .compile();

    app = module.createNestApplication();
    await app.init();

    graphql = new GraphqlTestClient(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Query characters", () => {
    const GetOwnedCharacters = (owner: string, adventure: string) => gql`
    query GetOwnedCharacters {
      characters(owner: "${owner}", adventure: "${adventure}"){
        name
        owner
        adventure
        description
      }
    }
    `;

    it("should return all characters owned by an user", async () => {
      const jojo = CharacterFixtures.Jojo.build();
      const dio = CharacterFixtures.Dio.build();
      const notOwned = CharacterFixtures.Jojo.for("Aetherall").build();

      characterStore.add(jojo);
      characterStore.add(dio);
      characterStore.add(notOwned);

      const { errors, data } = await graphql.execute(GetOwnedCharacters("Atalykis", "TheGreatEscape"));

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        characters: [
          { name: "Jojo", owner: "Atalykis", adventure: "TheGreatEscape", description: "Default description" },
          { name: "Dio", owner: "Atalykis", adventure: "TheGreatEscape", description: "Default description" },
        ],
      });
    });
  });
});
