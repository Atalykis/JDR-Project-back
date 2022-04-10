import { AdventureStore } from "../application/adventure.store";
import { Adventure } from "../domain/adventure";
import { AdventureFixtures } from "../domain/adventure.builder";

export class AdventureStoreInMemory implements AdventureStore {
  adventures: Adventure[] = [AdventureFixtures.greatEscape, AdventureFixtures.basicAdventure];

  async add(adventure: Adventure) {
    this.adventures.push(adventure);
  }

  async load(name: string) {
    return this.adventures.find((a) => a.name === name);
  }

  async loadAll(): Promise<Adventure[]> {
    return this.adventures;
  }
}
