import { AdventureStore } from "./adventure.store";

export type GetUsersQuery = {
  adventure: string;
};

export class GetUsersHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  handle(query: GetUsersQuery) {
    const adventure = this.adventureStore.load(query.adventure);
    return adventure?.adventurers;
  }
}
