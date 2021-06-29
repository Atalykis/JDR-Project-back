import { Character } from "../domain/character";
import { CharacterStoreInMemory } from "../infrastructure/character.store.in-memory";
import { CannotCreateCharacterWithAlreadyTakenNameForUserError, CreateCharacterCommand, CreateCharacterHandler } from "./create-character.comand";

describe("CreateCharacterCommand", () => {
  it("should create a character", () => {
    const characterStore = new CharacterStoreInMemory();
    const command: CreateCharacterCommand = { name: "Bill", user: "Cyril" };
    const handler = new CreateCharacterHandler(characterStore);

    handler.handle(command);

    const createdCharacter = characterStore.load("Cyril", "Bill");
    expect(createdCharacter).toBeDefined();
  });

  it("should fail if user already owns a character with the same name", () => {
    const characterStore = new CharacterStoreInMemory();
    const existing = new Character("Bill", "Cyril");
    characterStore.add(existing);
    const command: CreateCharacterCommand = { name: "Bill", user: "Cyril" };
    const handler = new CreateCharacterHandler(characterStore);

    expect(() => handler.handle(command)).toThrow(CannotCreateCharacterWithAlreadyTakenNameForUserError);
  });
});
