import { CharacterStore } from "../character.store";

export interface GetCharactersQuery {
  owner: string;
  adventure: string;
}

export class GetCharactersHandler {
  constructor(public readonly characterStore: CharacterStore) {}

  async handle(query: GetCharactersQuery) {
    const result = await this.characterStore.loadOwnedForAdventure(query.owner, query.adventure);
    return result;
  }
}
