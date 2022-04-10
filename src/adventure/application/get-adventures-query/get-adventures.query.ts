import { AdventureStore } from "../adventure.store";

export interface GetAdventuresQuery {}

export class GetAdventuresQueryHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  async handle(_query: GetAdventuresQuery) {
    const adventures = await this.adventureStore.loadAll();
    return adventures.map((adventure) => {
      return {
        name: adventure.name,
        gm: adventure.gm,
      };
    });
  }
}
