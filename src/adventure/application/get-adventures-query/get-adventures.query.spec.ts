import { Adventure } from "../../domain/adventure";
import { AdventureFixtures } from "../../domain/adventure.builder";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "../adventure.store";
import { GetAdventuresQuery, GetAdventuresQueryHandler } from "./get-adventures.query";

describe("Get Adventures Query", () => {
  it("should get all the adventures", async () => {
    const query: GetAdventuresQuery = {};
    const adventureStore = new AdventureStoreInMemory();

    const greatEscape = AdventureFixtures.greatEscape;
    const basicAdventure = AdventureFixtures.basicAdventure;
    adventureStore.add(greatEscape);
    adventureStore.add(basicAdventure);

    const handler = new GetAdventuresQueryHandler(adventureStore);

    const adventures = await handler.handle(query);
    expect(adventures).toEqual([
      {
        name: greatEscape.name,
        gm: greatEscape.gm,
      },
      {
        name: basicAdventure.name,
        gm: basicAdventure.gm,
      },
    ]);
  });
});
