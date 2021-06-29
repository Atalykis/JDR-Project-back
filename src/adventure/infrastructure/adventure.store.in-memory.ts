import { AdventureStore } from "../application/adventure.store";
import { Adventure } from "../domain/adventure";

export class AdventureStoreInMemory implements AdventureStore {
  adventures: Adventure[] = [];

  add(adventure: Adventure) {
    this.adventures.push(adventure);
  }

  load(name: string) {
    return this.adventures.find((a) => a.name === name);
  }
}
