import { AdventureStore } from "../application/adventure.store";
import { Adventure } from "../domain/adventure";
import { AdventureFixtures } from "../domain/adventure.builder";

export class AdventureStoreInMemory implements AdventureStore {
  adventures: Adventure[] = [AdventureFixtures.basicAdventure, AdventureFixtures.greatEscape];
  async init() {
    this.adventures = [AdventureFixtures.basicAdventure, AdventureFixtures.greatEscape];
  }

  async onModuleInit() {
    await this.init();
  }
  async add(adventure: Adventure) {
    this.adventures.push(adventure);
  }

  async load(name: string) {
    return this.adventures.find((a) => a.name === name);
  }

  async loadManyFromGm(gm: string): Promise<Adventure[]> {
    return this.adventures.filter((adventure) => adventure.gm === gm)
  }

  async loadAll(): Promise<Adventure[]> {
    return this.adventures;
  }

  async clear() {
    this.adventures = [];
  }
}
