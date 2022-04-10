import { Adventure } from "../../domain/adventure";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "../adventure.store";
import { CannotJoinNonExistingAdventureError, JoinAdventureCommand, JoinAdventureHandler } from "./join-adventure.command";

describe("JoinAdventureCommand", () => {
  it("should allow a User to join a room as a player", async () => {
    const command: JoinAdventureCommand = { adventure: "GreatEscape", user: "ZephDio" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const adventure = new Adventure("GreatEscape", "gm");
    await adventureStore.add(adventure);

    const handler = new JoinAdventureHandler(adventureStore);

    await handler.handle(command);

    expect(adventure.adventurers).toEqual(["ZephDio"]);
  });

  it("should fail if the adventure doesn't exist", async () => {
    const command: JoinAdventureCommand = { adventure: "GreatEscape", user: "ZephDio" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();

    const handler = new JoinAdventureHandler(adventureStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotJoinNonExistingAdventureError);
  });
});
