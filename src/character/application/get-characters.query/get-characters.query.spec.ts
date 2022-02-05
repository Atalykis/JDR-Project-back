import { Character } from "../../domain/character";
import { CharacterStoreInMemory } from "../../infrastructure/character.store.in-memory";
import { GetCharactersHandler, GetCharactersQuery } from "./get-characters.query";

describe("GetCharactersQuery", () => {
  it("should retrieve a list of character owned by a user", () => {
    const characterStore = new CharacterStoreInMemory();
    const handler = new GetCharactersHandler(characterStore);

    const mainCharacter = new Character("Jojoo", "Atalykis", "Jeune homme très très viril", "TheGreatEscape");
    characterStore.add(mainCharacter);
    const secondaryCharacter = new Character("Dio", "Atalykis", "Vieil homme très très mort", "TheGreatEscape");
    characterStore.add(secondaryCharacter);

    const query: GetCharactersQuery = { owner: "Atalykis", adventure: "TheGreatEscape" };
    const characters = handler.handle(query);

    expect(characters).toEqual([mainCharacter, secondaryCharacter]);
  });
});
