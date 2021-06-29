import { Adventure } from "../domain/adventure";
import { AdventureStoreInMemory } from "../infrastructure/adventure.store.in-memory";
import { AdventureStore } from "./adventure.store";
import { JoinAdventureCommand, JoinAdventureHandler } from "./join-adventure.command";

describe("JoinAdventureCommand", () => {
  it("should allow a User to join a room as a player", () => {
    const command: JoinAdventureCommand = { adventure: "GreatEscape", user: "ZephDio" };
    const adventureStore: AdventureStore = new AdventureStoreInMemory();
    const adventure = new Adventure("GreatEscape", "mj");
    adventureStore.add(adventure);

    const handler = new JoinAdventureHandler(adventureStore);

    handler.handle(command);

    expect(adventure.adventurers).toEqual(["ZephDio"]);
  });
});
