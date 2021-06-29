import { Adventure } from "../domain/adventure";

export interface AdventureStore {
  add(adventure: Adventure): void;
  load(name: string): Adventure | undefined;
}
