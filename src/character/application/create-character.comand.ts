export interface CreateCharacterCommand {
  name: string;
  user: string;
}

interface CharacterStore {
  add(character: Character): void;
  load(owner: string, name: string): Character | undefined;
}

export class CharacterStoreInMemory implements CharacterStore {
  characters: Character[] = [];

  add(character: Character) {
    this.characters.push(character);
  }

  load(owner: string, name: string) {
    return this.characters.find((c) => c.name === name && c.owner === owner);
  }
}

export class Character {
  constructor(public readonly name: string, public readonly owner: string) {}
}

export class CreateCharacterHandler {
  constructor(private readonly characterStore: CharacterStore) {}

  handle(command: CreateCharacterCommand) {
    const existing = this.characterStore.load(command.user, command.name);
    if (existing) {
      throw new CannotCreateCharacterWithAlreadyTakenNameForUserError(command.user, command.name);
    }
    const character = new Character(command.name, command.user);
    this.characterStore.add(character);
  }
}

export class CannotCreateCharacterWithAlreadyTakenNameForUserError extends Error {
  constructor(user: string, name: string) {
    super(`Cannot create character because user ${user} already owns a character named ${name}`);
  }
}
