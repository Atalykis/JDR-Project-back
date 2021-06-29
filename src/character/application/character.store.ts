import { Character } from "../domain/character";

export interface CharacterStore {
  add(character: Character): void;
  load(owner: string, name: string): Character | undefined;
}
