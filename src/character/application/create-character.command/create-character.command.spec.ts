import { Character, CharacterIdentity } from "../../domain/character";
import { CharacterStoreInMemory } from "../../infrastructure/character.store.in-memory";
import { CannotCreateCharacterWithAlreadyTakenNameForUserError, CreateCharacterCommand, CreateCharacterHandler } from "./create-character.comand";

describe("CreateCharacterCommand", () => {
  it("should create a character", async () => {
    const characterStore = new CharacterStoreInMemory();
    const command: CreateCharacterCommand = { name: "Bill", user: "Cyril", description: "Vieil homme très très riche", adventure: "GreatEscape" };
    const handler = new CreateCharacterHandler(characterStore);

    await handler.handle(command);

    const createdCharacter = await characterStore.load(new CharacterIdentity("Bill", "Cyril", "GreatEscape"));
    expect(createdCharacter).toBeDefined();
  });

  it("should fail if user already owns a character with the same name", async () => {
    const characterStore = new CharacterStoreInMemory();
    const existing = new Character("Bill", "Cyril", "GreatEscape", "Vieil homme très très riche");
    await characterStore.add(existing);
    const command: CreateCharacterCommand = { name: "Bill", user: "Cyril", description: "Vieil homme très très riche", adventure: "GreatEscape" };
    const handler = new CreateCharacterHandler(characterStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotCreateCharacterWithAlreadyTakenNameForUserError);
  });
});
