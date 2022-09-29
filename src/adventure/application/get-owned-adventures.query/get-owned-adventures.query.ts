import { AdventureStore } from "../adventure.store"

export interface GetOwnedAdventuresQuery {
  gm: string
}

export class GetOwnedAdventuresQueryHandler {
  constructor(private readonly adventureStore: AdventureStore){}

  async handle(query: GetOwnedAdventuresQuery){
    const adventures = await this.adventureStore.loadManyFromGm(query.gm)
    return adventures
  }
}