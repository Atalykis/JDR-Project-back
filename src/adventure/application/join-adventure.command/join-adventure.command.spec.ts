import { Adventure } from "../../domain/adventure";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "../adventure.store";
import { CannotJoinNonExistingAdventureError, JoinAdventureCommand, JoinAdventureHandler } from "./join-adventure.command";

describe("JoinAdventureCommand", () => {
  it("should allow a User to join a room as a player", () => {
    const command: JoinAdventureCommand = { adventure: "GreatEscape", user: "ZephDio" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const adventure = new Adventure("GreatEscape", "gm");
    adventureStore.add(adventure);

    const handler = new JoinAdventureHandler(adventureStore);

    handler.handle(command);

    expect(adventure.adventurers).toEqual(["ZephDio"]);
  });

  it("should fail if the adventure doesn't exist", () => {
    const command: JoinAdventureCommand = { adventure: "GreatEscape", user: "ZephDio" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();

    const handler = new JoinAdventureHandler(adventureStore);

    expect(() => handler.handle(command)).toThrow(CannotJoinNonExistingAdventureError);
  });
});
