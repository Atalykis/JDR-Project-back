import { Adventure } from "../domain/adventure";

export interface AdventureStore {
  add(adventure: Adventure): Promise<void>;
  load(name: string): Promise<Adventure | undefined>;

  loadAll(): Promise<Adventure[]>;
}
