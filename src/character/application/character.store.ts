import { Character, CharacterIdentity } from "../domain/character";

export interface CharacterStore {
  add(character: Character): void;
  load(character: CharacterIdentity): Character | undefined;
  loadOwnedForAdventure(owner: string, adventure: string): Character[];
  loadMany(charactersIds: CharacterIdentity[]): Character[];
}
