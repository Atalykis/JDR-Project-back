import { Universe } from "../../domain/universe"
import { UniverseStoreInMemory } from "../../infrastructure/universe.store.in-memory"
import { CannotRetrieveNonExistingUniverseError, GetUniverseQuery, GetUniverseQueryHandler } from "./get-universe.query"

describe("GetUniverseQuery", () => {
  it("should allow a user to retrieve a universe", async () => {
    const query: GetUniverseQuery = { name: "Universe"}
    const universeStore = new UniverseStoreInMemory()
    const universe = new Universe("Universe", "Atalykis")
    await universeStore.add(universe)

    const handler = new GetUniverseQueryHandler(universeStore)

    const loaded = await handler.handle(query)

    expect(loaded).toEqual(universe)
  })

  it("should fail if the universe doesn't exist", async () => {
    const query: GetUniverseQuery = { name: "Universe"}
    const universeStore = new UniverseStoreInMemory()

    const handler = new GetUniverseQueryHandler(universeStore)
    
    await expect(() => handler.handle(query)).rejects.toThrow(CannotRetrieveNonExistingUniverseError);
  })
})

