import { CharacterIdentity } from "../../domain/character";
import { CharacterStore } from "../character.store";

export interface GetCharacterQuery {
  character: CharacterIdentity;
}

export class GetCharacterHandler {
  constructor(public readonly characterStore: CharacterStore) {}

  handle(query: GetCharacterQuery) {
    const result = this.characterStore.load(query.character);
    console.log(result);
    return result;
  }
}
