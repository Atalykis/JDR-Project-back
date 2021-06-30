import { CannotGetPlayersOfNonExistingRoom } from "../../room/application/get-room-players.query";
import { AdventureStore } from "./adventure.store";

export type GetUsersQuery = {
  adventure: string;
};

export class GetUsersHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  handle(query: GetUsersQuery) {
    const adventure = this.adventureStore.load(query.adventure);
    if (!adventure) {
      throw new CannotGetUsersOfNonExistingAdventureError(query.adventure);
    }
    return adventure.adventurers;
  }
}

export class CannotGetUsersOfNonExistingAdventureError extends Error {
  constructor(adventure: string) {
    super(`Cannot get user of non existing adventure ${adventure}`);
  }
}
