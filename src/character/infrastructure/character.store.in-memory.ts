import { CharacterStore } from "../application/character.store";
import { Character } from "../domain/character";

export class CharacterStoreInMemory implements CharacterStore {
  characters: Character[] = [
    { name: "Jojoo", owner: "Atalykis", adventure: "TheBizarreAdventure" },
    { name: "Dio", owner: "Atalykis", adventure: "TheBizarreAdventure" },
  ];

  add(character: Character) {
    this.characters.push(character);
  }

  load(owner: string, name: string) {
    return this.characters.find((c) => c.name === name && c.owner === owner);
  }

  loadOwnedForAdventure(owner: string, adventure: string) {
    return this.characters.filter((c) => c.owner === owner && c.adventure === adventure);
  }
}
