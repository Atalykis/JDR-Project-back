import { Universe } from "../../domain/universe"
import { UniverseStoreInMemory } from "../../infrastructure/universe.store.in-memory"
import { CannotCreateUniverseWithAlreadyTakenNameError, CreateUniverseCommand, CreateUniverseCommandHandler } from "./create-universe.command"

describe("CreateUniverseCommand", () => {
  it("should create a user", async () => {
    const universeStore = new UniverseStoreInMemory()
    const command: CreateUniverseCommand = { name: "Universe", owner: "Atalykis" }

    const handler = new CreateUniverseCommandHandler(universeStore)

    await handler.handle(command) 

    const loaded = await universeStore.load(command.name)

    expect(loaded).toBeDefined()
  })

  it("should not allow a user to create two universe with same name", async () => {
    const universeStore = new UniverseStoreInMemory()
    const existing = new Universe('Existing', 'Atalykis')
    const command: CreateUniverseCommand = { name: "Existing", owner: "Atalykis" }
    await universeStore.add(existing)

    const handler = new CreateUniverseCommandHandler(universeStore)

    await expect(() => handler.handle(command)).rejects.toThrow(CannotCreateUniverseWithAlreadyTakenNameError);
  })
})

