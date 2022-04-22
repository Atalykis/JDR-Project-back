import { Character, CharacterIdentity } from "../domain/character";

export interface CharacterStore {
  add(character: Character): Promise<void>;
  load(character: CharacterIdentity): Promise<Character | undefined>;
  loadOwnedForAdventure(owner: string, adventure: string): Promise<Character[]>;
  loadMany(charactersIds: CharacterIdentity[]): Promise<Character[]>;
}
