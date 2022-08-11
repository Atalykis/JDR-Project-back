import { CharacterFixtures } from "../../domain/character.builder";
import { CharacterStoreInMemory } from "../store/character.store.in-memory";
import { gql } from "apollo-server-express";
import { DocumentNode, print } from "graphql";
import { Test, TestingModule } from "@nestjs/testing";
import { BackendModule } from "../../../backend.module";
import { INestApplication } from "@nestjs/common";
import { CharacterStore } from "../../application/character.store";
import request from "supertest";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { Character, CharacterIdentity } from "../../domain/character";
import { CannotGetUnexistingCharacterError } from "../../application/get-character.query /get-character.query";
import { CannotCreateCharacterWithAlreadyTakenNameForUserError } from "../../application/create-character.command/create-character.comand";

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
    graphql.as("Atalykis");
  });

  beforeEach(() => {
    characterStore.clear();
  });
  afterAll(async () => {
    await app.close();
  });

  describe("Query characters", () => {
    const query = gql`
      query GetOwnedCharacters($adventure: String!) {
        characters(adventure: $adventure) {
          name
          owner
          adventure
          description
        }
      }
    `;

    it("should return all characters inside an andventure owned by an user", async () => {
      const jojo = CharacterFixtures.Jojo;
      const dio = CharacterFixtures.Dio;
      await characterStore.add(jojo);
      await characterStore.add(dio);

      const { errors, data } = await graphql.execute(query, {
        adventure: "TheGreatEscape",
      });

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        characters: [{ name: "Jojo", owner: "Atalykis", adventure: "TheGreatEscape", description: "Default description" }],
      });
    });
  });

  describe("Query character", () => {
    const query = gql`
      query GetCharacter($name: String!, $adventure: String!) {
        character(name: $name, adventure: $adventure) {
          name
          owner
          adventure
          description
        }
      }
    `;
    it("should return a character", async () => {
      const jojo = CharacterFixtures.Jojo;
      characterStore.add(jojo);

      const { errors, data } = await graphql.execute(query, {
        name: jojo.name,
        adventure: jojo.adventure,
      });

      expect(errors).toBeUndefined();
      expect(data).toEqual({
        character: {
          name: "Jojo",
          owner: "Atalykis",
          adventure: "TheGreatEscape",
          description: "Default description",
        },
      });
    });

    it("should fail if the character does not exist", async () => {
      const dio = CharacterFixtures.Dio;
      const { errors, data } = await graphql.execute(query, {
        name: dio.name,
        adventure: dio.adventure,
      });

      expect(errors[0].message).toEqual(new CannotGetUnexistingCharacterError(dio.identity).message);
    });
  });

  describe("Mutation createCharacter", () => {
    const mutation = gql`
      mutation CreateCharacter($name: String!, $adventure: String!, $description: String!) {
        createCharacter(name: $name, adventure: $adventure, description: $description) {
          name
          owner
          adventure
          description
        }
      }
    `;
    it("should allow a user to create a character", async () => {
      const { errors, data } = await graphql.execute(mutation, {
        name: "Adventurer",
        adventure: "TheGreatEscape",
        description: "Default description",
      });

      const createdCharacter = await characterStore.load(new CharacterIdentity("Adventurer", "Atalykis", "TheGreatEscape"));

      expect(errors).toBeUndefined();
      expect(createdCharacter).toBeDefined();
      expect(data).toEqual({
        createCharacter: {
          name: "Adventurer",
          owner: "Atalykis",
          adventure: "TheGreatEscape",
          description: "Default description",
        },
      });
    });

    it("should fail if the user already got a character with the same name", async () => {
      const jojo = CharacterFixtures.Jojo;
      await characterStore.add(jojo);

      const { errors, data } = await graphql.execute(mutation, {
        name: jojo.name,
        adventure: jojo.adventure,
        description: jojo.description,
      });

      expect(errors[0].message).toEqual(new CannotCreateCharacterWithAlreadyTakenNameForUserError("Atalykis", jojo.name).message);
    });
  });
});
