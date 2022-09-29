import { AdventureFixtures } from "../../domain/adventure.builder";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory"
import { AdventureStore } from "../adventure.store";
import { GetOwnedAdventuresQuery, GetOwnedAdventuresQueryHandler } from "./get-owned-adventures.query";

describe("GetOwnedAdventureQuery", () => {
  it("should get all adventures owned by a user", async () => {
    const query: GetOwnedAdventuresQuery = { gm : "Atalykis" }
    const adventureStore = new AdventureStoreInMemory();
    const adventure = AdventureFixtures.atalykisAdventure
    const adventure2 = AdventureFixtures.atalykisAdventure2
    adventureStore.add(adventure)
    adventureStore.add(adventure2)

    const handler = new GetOwnedAdventuresQueryHandler(adventureStore)

    const adventures = await handler.handle(query)
    expect(adventures).toEqual([adventure, adventure2])
  })
})

