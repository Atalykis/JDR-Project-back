import { Adventure } from "../../domain/adventure";
import { AdventureStore } from "../adventure.store";

export interface GetAdventureQuery {
  name: string;
}

export class GetAdventureQueryHandler {
  constructor(private readonly adventureStore: AdventureStore) {}

  async handle(query: GetAdventureQuery): Promise<Adventure> {
    const adventure = await this.adventureStore.load(query.name);
    if (!adventure) {
      throw new CannotRetrieveNonExistingAdventureError(query.name);
    }
    return adventure;
  }
}
export class CannotRetrieveNonExistingAdventureError extends Error {
  constructor(name: string) {
    super(`Cannot retrieve non existing adventure ${name}`);
  }
}
