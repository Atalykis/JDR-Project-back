import { CharacterStore } from "../application/character.store";
import { Character } from "../domain/character";

export class CharacterStoreInMemory implements CharacterStore {
  characters: Character[] = [
    { name: "Jojoo", owner: "Atalykis", description: "Jeune homme très très viril", adventure: "TheBizarreAdventure" },
    { name: "Dio", owner: "Atalykis", description: "You were exptecting a description, but it was me DIO", adventure: "TheBizarreAdventure" },
    { name: "Jojoo", owner: "Zeph0", description: "Jeune homme très très viril", adventure: "TheBizarreAdventure" },
    { name: "Dio", owner: "Zeph0", description: "You were exptecting a description, but it was me DIO", adventure: "TheBizarreAdventure" },
    { name: "Jojoo", owner: "Aetherall", description: "Jeune homme très très viril", adventure: "TheBizarreAdventure" },
    { name: "Dio", owner: "Aetherall", description: "You were exptecting a description, but it was me DIO", adventure: "TheBizarreAdventure" },
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
