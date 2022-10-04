import { UniverseStore } from "../universe.store"

export interface GetUniverseQuery {
  name: string
}

export class GetUniverseQueryHandler {
  constructor(private readonly universeStore: UniverseStore){}

  async handle(query: GetUniverseQuery){
    const universe = await this.universeStore.load(query.name)
    if(!universe){
      throw new CannotRetrieveNonExistingUniverseError(query.name)
    }
    return universe
  }
}

export class CannotRetrieveNonExistingUniverseError extends Error {
  constructor(name: string){
    super(`Cannot retrieve non existing universe : ${name}`)
  }
}