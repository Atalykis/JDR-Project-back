import { CharacterIdentity } from "../../domain/character";
import { CharacterStore } from "../character.store";

export interface GetCharacterQuery {
  character: CharacterIdentity;
}

export class GetCharacterHandler {
  constructor(public readonly characterStore: CharacterStore) {}

  async handle(query: GetCharacterQuery) {
    const result = await this.characterStore.load(query.character);
    return result;
  }
}
