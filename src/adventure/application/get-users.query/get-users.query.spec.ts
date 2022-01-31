import { Adventure } from "../../domain/adventure";
import { AdventureStoreInMemory } from "../../infrastructure/adventure.store.in-memory";
import { GetUsersQuery, GetUsersHandler, CannotGetUsersOfNonExistingAdventureError } from "./get-users.query";

describe("get users names query", () => {
  it("should get all names of character from an adventure", () => {
    const query: GetUsersQuery = { adventure: "GreatEscape" };
    const adventureStore = new AdventureStoreInMemory();
    const adventure = new Adventure("GreatEscape", "gm");
    adventure.join("Aetherall");
    adventureStore.add(adventure);

    const handler = new GetUsersHandler(adventureStore);

    const users = handler.handle(query);
    expect(users).toEqual(["Aetherall"]);
  });

  it("should fail if the adventure doesn't exist", () => {
    const query: GetUsersQuery = { adventure: "GreatEscape" };
    const adventureStore = new AdventureStoreInMemory();

    const handler = new GetUsersHandler(adventureStore);

    expect(() => handler.handle(query)).toThrow(CannotGetUsersOfNonExistingAdventureError);
  });
});
