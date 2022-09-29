import { Adventure } from "../domain/adventure";

export interface AdventureStore {
  add(adventure: Adventure): Promise<void>;
  load(name: string): Promise<Adventure | undefined>;
  loadManyFromGm(gm: string): Promise<Adventure[]>
  loadAll(): Promise<Adventure[]>;
}
