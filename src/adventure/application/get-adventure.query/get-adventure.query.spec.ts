import { AdventureFixtures } from "../../domain/adventure.builder";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { GetAdventureQuery, GetAdventureQueryHandler } from "./get-adventure.query";

describe("Get Adventures Query", () => {
  it("should get a specific adventure", async () => {
    const query: GetAdventureQuery = { name: "TheGreatEscape" };
    const adventureStore = new AdventureStoreInMemory();

    const greatEscape = AdventureFixtures.greatEscape;
    adventureStore.add(greatEscape);

    const handler = new GetAdventureQueryHandler(adventureStore);

    const adventure = await handler.handle(query);
    expect(adventure).toEqual({
      name: greatEscape.name,
      gm: greatEscape.gm,
    });
  });
});
