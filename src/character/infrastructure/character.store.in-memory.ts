import { CharacterStore } from "../application/character.store";
import { Character } from "../domain/character";

export class CharacterStoreInMemory implements CharacterStore {
  characters: Character[] = [];

  add(character: Character) {
    this.characters.push(character);
  }

  load(owner: string, name: string) {
    return this.characters.find((c) => c.name === name && c.owner === owner);
  }
}
