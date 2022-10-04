import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { gql } from "apollo-server-express";
import { Query } from "mongoose";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { Universe } from "../../domain/universe";
import { UniverseStoreInMemory } from "../universe.store.in-memory";

describe("UniverseResolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;
  const universeStore = new UniverseStoreInMemory();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("UniverseStore")
      .useValue(universeStore)
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
    universeStore.clear()
  })

  describe("create universe mutation", () => {
    const mutation = gql`
      mutation CreateUniverse($name: String!) {
        createUniverse(name: $name) {
          name
          owner
        }
      }
    `
    it("should allow a user to create an universe", async () => {
      const result = await graphql.execute(mutation, { name: "TheGreatUniverse" });

      const createdUniverse = await universeStore.load("TheGreatUniverse");

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        createUniverse: {
          name: "TheGreatUniverse",
          owner: "Atalykis"
        },
      });
      expect(createdUniverse).toBeDefined();
    });
  })

  describe("get universe query", () => {
    const query = gql`
      query Universe($name: String!){
        universe(name: $name){
          name
          owner
        }
      }
    `

    it("should allow a user to retrive a specific universe", async () => {
      const universe = new Universe("Universe", 'Atalykis')
      await universeStore.add(universe);

      const result = await graphql.execute(query, { name: "Universe" });
      
      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        universe: {
          name: "Universe",
          owner: "Atalykis"
        },
      });
    });
  })

  describe("get owned universes query", () => {
    const query = gql`
      query OwnedUniverses{
        ownedUniverses{
          name
          owner
        }
      }
    `

    it("should allow a user to retrive all his universe", async () => {
      const universe = new Universe("Universe", 'Atalykis')
      const universe2 = new Universe("Universy-T", 'Atalykis')

      await universeStore.add(universe);
      await universeStore.add(universe2);

      const result = await graphql.execute(query);
      
      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        ownedUniverses: [{
          name: "Universe",
          owner: "Atalykis"
        }, {
          name: "Universy-T",
          owner: "Atalykis"
        }],
      });
    });
  })

})