import { Character, CharacterIdentity } from "../../domain/character";
import { CharacterStoreInMemory } from "../../infrastructure/store/character.store.in-memory";
import { GetCharacterQuery, GetCharacterHandler } from "./get-character.query";

describe("GetCharactersQuery", () => {
  it("should retrieve a character owned by a user in an Adventure", async () => {
    const characterStore = new CharacterStoreInMemory();
    const handler = new GetCharacterHandler(characterStore);

    const character = new Character("Jojoo", "Atalykis", "TheGreatEscape", "Jeune homme très très viril");
    await characterStore.add(character);

    const query: GetCharacterQuery = { character: new CharacterIdentity("Jojoo", "Atalykis", "TheGreatEscape") };
    const loaded = await handler.handle(query);

    expect(loaded).toEqual(character);
  });
});
