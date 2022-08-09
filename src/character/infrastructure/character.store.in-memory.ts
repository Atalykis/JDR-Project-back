import { CharacterStore } from "../application/character.store";
import { Character, CharacterIdentity } from "../domain/character";

export class CharacterStoreInMemory implements CharacterStore {
  characters: Character[] = [];

  async init() {
    this.characters = [];
  }

  async onModuleInit() {
    await this.init();
  }
  async add(character: Character) {
    this.characters.push(character);
  }

  async load(character: CharacterIdentity) {
    return this.characters.find((c) => c.name === character.name && c.adventure === character.adventure && c.owner === character.owner);
  }

  async loadOwnedForAdventure(owner: string, adventure: string) {
    const result = this.characters.filter((c) => c.owner === owner && c.adventure === adventure);
    return result;
  }

  async loadMany(characterIds: CharacterIdentity[]) {
    const loaded: Character[] = [];
    for (const id of characterIds) {
      const stored = this.characters.find((c) => c.identity.equals(id));
      if (!stored) {
        throw new Error(`Could not find character ${id.toString()}`);
      }
      loaded.push(stored);
    }
    return loaded;
  }

  async clear() {
    this.characters = [];
  }
}
