import { AdventureStore } from "./adventure.store";

export interface JoinAdventureCommand {
  adventure: string;
  user: string;
}

export class JoinAdventureHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  handle(command: JoinAdventureCommand) {
    const adventure = this.adventureStore.load(command.adventure);
    if (!adventure) {
      throw new Error(command.adventure);
    }
    adventure.join(command.user);
  }
}

// CannotJoinNonExistingAdventureError
