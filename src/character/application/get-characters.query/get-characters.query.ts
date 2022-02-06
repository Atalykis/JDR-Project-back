import { CharacterStore } from "../character.store";

export interface GetCharactersQuery {
  owner: string;
  adventure: string;
}

export class GetCharactersHandler {
  constructor(public readonly characterStore: CharacterStore) {}

  handle(query: GetCharactersQuery) {
    const result = this.characterStore.loadOwnedForAdventure(query.owner, query.adventure);
    return result;
  }
}
