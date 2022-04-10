import { Adventure } from "../../domain/adventure";
import { AdventureStore } from "../adventure.store";

export interface CreateAdventureCommand {
  name: string;
  gm: string;
}

export class CreateAdventureHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  async handle(command: CreateAdventureCommand) {
    const existing = await this.adventureStore.load(command.name);
    if (existing) {
      throw new CannotCreateAdventureWithAlreadyTakenNameError(command.name);
    }
    const adventure = new Adventure(command.name, command.gm);
    await this.adventureStore.add(adventure);
  }
}

export class CannotCreateAdventureWithAlreadyTakenNameError extends Error {
  constructor(name: string) {
    super(`Cannot create adventure with already taken name : ${name}`);
  }
}
