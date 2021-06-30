import { Adventure } from "../../domain/adventure";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "../adventure.store";
import { CannotCreateAdventureWithAlreadyTakenNameError, CreateAdventureCommand, CreateAdventureHandler } from "./create-adventure.command";

describe("AdventureCreationCommand", () => {
  it("should allow a user to create a new Adventure", () => {
    const command: CreateAdventureCommand = { name: "adventure", mj: "Mj" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const handler = new CreateAdventureHandler(adventureStore);

    handler.handle(command);

    const adventure = adventureStore.load("adventure");
    expect(adventure).toBeDefined();
  });

  it("should not allow a user to create two room with same name", () => {
    const command: CreateAdventureCommand = { name: "room", mj: "Mj" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const handler = new CreateAdventureHandler(adventureStore);
    const existing = new Adventure("room", "Mj");
    adventureStore.add(existing);

    expect(() => handler.handle(command)).toThrow(CannotCreateAdventureWithAlreadyTakenNameError);
  });
});
