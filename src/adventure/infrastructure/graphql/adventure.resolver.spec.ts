import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { gql } from "apollo-server-express";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { AdventureModule } from "../../adventure.module";
import { AdventureFixtures } from "../../domain/adventure.builder";
import { AdventureStoreInMemory } from "../adventure.store.in-memory";

describe("AdventureResolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;
  const adventureStore = new AdventureStoreInMemory();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("AdventureStore")
      .useValue(adventureStore)
      .compile();

    app = module.createNestApplication();
    await app.init();

    graphql = new GraphqlTestClient(app);
    graphql.as("Atalykis");
  });

  afterAll(async () => {
    await app.close();
  });

  describe("adventures query", () => {
    const query = gql`
      query GetAdventures {
        adventures {
          name
          gm
        }
      }
    `;
    it("should allow a user to retrieve all the adventures", async () => {
      const greatEscape = AdventureFixtures.greatEscape;
      const basicAdventure = AdventureFixtures.basicAdventure;
      await adventureStore.add(greatEscape);
      await adventureStore.add(basicAdventure);

      const result = await graphql.execute(query, {});

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        adventures: [
          {
            name: greatEscape.name,
            gm: greatEscape.gm,
          },
          {
            name: basicAdventure.name,
            gm: basicAdventure.gm,
          },
        ],
      });
    });
  });
});
