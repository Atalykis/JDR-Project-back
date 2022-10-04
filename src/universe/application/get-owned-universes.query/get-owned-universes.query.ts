import { UniverseStore } from "../universe.store"

export interface GetOwnedUniversesQuery {
  owner: string
}

export class GetOwnedUniversesQueryHandler {
  constructor(private readonly universeStore: UniverseStore){}

  async handle(query: GetOwnedUniversesQuery){
    const universes = await this.universeStore.loadManyByOwner(query.owner)
    return universes
  }
}