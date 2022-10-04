import { Universe } from "../../domain/universe"
import { UniverseStoreInMemory } from "../../infrastructure/universe.store.in-memory"
import { GetOwnedUniversesQuery, GetOwnedUniversesQueryHandler } from "./get-owned-universes.query"

describe("GetUniverseQuery", () => {
  it("should allow a user to retrieve all his universe", async () => {
    const query: GetOwnedUniversesQuery = { owner: "Atalykis"}
    const universeStore = new UniverseStoreInMemory()
    const universe = new Universe("Universe", "Atalykis")
    const universe2 = new Universe("Universy-T", 'Atalykis')
    await universeStore.add(universe)
    await universeStore.add(universe2)


    const handler = new GetOwnedUniversesQueryHandler(universeStore)

    const loaded = await handler.handle(query)

    expect(loaded).toEqual([universe, universe2])
  })
})
