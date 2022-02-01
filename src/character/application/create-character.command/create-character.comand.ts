import { Character } from "../../domain/character";
import { CharacterStore } from "../character.store";

export interface CreateCharacterCommand {
  name: string;
  user: string;
  adventure: string;
}

export class CreateCharacterHandler {
  constructor(private readonly characterStore: CharacterStore) {}

  handle(command: CreateCharacterCommand) {
    const existing = this.characterStore.load(command.user, command.name);

    if (existing) {
      throw new CannotCreateCharacterWithAlreadyTakenNameForUserError(command.user, command.name);
    }
    const character = new Character(command.name, command.user, command.adventure);
    this.characterStore.add(character);
    return character.name;
  }
}

export class CannotCreateCharacterWithAlreadyTakenNameForUserError extends Error {
  constructor(user: string, name: string) {
    super(`Cannot create character because user ${user} already owns a character named ${name}`);
  }
}
