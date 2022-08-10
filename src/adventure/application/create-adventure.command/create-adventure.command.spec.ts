import { Adventure } from "../../domain/adventure";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "../adventure.store";
import { CannotCreateAdventureWithAlreadyTakenNameError, CreateAdventureCommand, CreateAdventureHandler } from "./create-adventure.command";

describe("AdventureCreationCommand", () => {
  it("should allow a user to create a new Adventure", async () => {
    const command: CreateAdventureCommand = { name: "adventure", gm: "Gm" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const handler = new CreateAdventureHandler(adventureStore);

    await handler.handle(command);

    const adventure = await adventureStore.load("adventure");
    expect(adventure).toBeDefined();
  });

  it("should not allow a user to create two adventure with same name", async () => {
    const command: CreateAdventureCommand = { name: "existing", gm: "Gm" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const handler = new CreateAdventureHandler(adventureStore);
    const existing = new Adventure("existing", "Gm");
    await adventureStore.add(existing);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotCreateAdventureWithAlreadyTakenNameError);
  });
});
