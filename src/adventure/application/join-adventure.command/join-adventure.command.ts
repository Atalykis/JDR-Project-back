import { AdventureStore } from "../adventure.store";

export interface JoinAdventureCommand {
  adventure: string;
  user: string;
}

export class JoinAdventureHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  handle(command: JoinAdventureCommand) {
    const adventure = this.adventureStore.load(command.adventure);
    if (!adventure) {
      throw new CannotJoinNonExistingAdventureError(command.adventure);
    }
    adventure.join(command.user);
  }
}

export class CannotJoinNonExistingAdventureError extends Error {
  constructor(name: string) {
    super(`Cannot join non existing adventure ${name}`);
  }
}
