import { Universe } from "../domain/universe"

export interface UniverseStore {
  add(universe: Universe): Promise<void>
  load(name: string): Promise<Universe|undefined>
  loadManyByOwner(owner: string): Promise<Universe[]>
}
