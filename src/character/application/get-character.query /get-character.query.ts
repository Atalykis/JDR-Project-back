import { CharacterIdentity } from "../../domain/character";
import { CharacterStore } from "../character.store";

export interface GetCharacterQuery {
  character: CharacterIdentity;
}

export class GetCharacterHandler {
  constructor(public readonly characterStore: CharacterStore) {}

  async handle(query: GetCharacterQuery) {
    const result = await this.characterStore.load(query.character);
    if (!result) {
      throw new CannotGetUnexistingCharacterError(query.character);
    }
    return result;
  }
}

export class CannotGetUnexistingCharacterError extends Error {
  constructor(character: CharacterIdentity) {
    super(`Cannot get character ${character.name} because it does not exist`);
  }
}
