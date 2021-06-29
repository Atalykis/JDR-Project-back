import { Adventure } from "../domain/adventure";
import { AdventureStoreInMemory } from "../infrastructure/adventure.store.in-memory";
import { GetUsersQuery, GetUsersHandler } from "./get-users.query";

describe("get users names query", () => {
  it("should get all names of character from an adventure", () => {
    const query: GetUsersQuery = { adventure: "GreatEscape" };
    const adventureStore = new AdventureStoreInMemory();
    const adventure = new Adventure("GreatEscape", "mj");
    adventure.join("Aetherall");
    adventureStore.add(adventure);

    const handler = new GetUsersHandler(adventureStore);

    const users = handler.handle(query);
    expect(users).toEqual(["Aetherall"]);
  });
});
