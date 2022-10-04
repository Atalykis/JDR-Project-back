import { UniverseStore } from "../application/universe.store"
import { Universe } from "../domain/universe"

export class UniverseStoreInMemory implements UniverseStore {
  private universes: Map<string, Universe> = new Map()

  async add(universe: Universe): Promise<void> {
    this.universes.set(universe.name, universe)
  }

  async load(name: string): Promise<Universe | undefined> {
    return this.universes.get(name)
  }

  async loadManyByOwner(owner: string): Promise<Universe[]> {
    const owned : Universe[] = []
    this.universes.forEach((value, k) => {
      if(value.owner === owner) {
        owned.push(value)
      }
    })
    return owned
  }

  clear(){
    this.universes = new Map()
  }
}

