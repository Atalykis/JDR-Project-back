import { CharacterTemplateStore } from "../character-template.store"

export interface GetUniverseCharacterTemplatesQuery {
  universe: string
}

export class GetUniverseCharacterTemplatesQueryHandler{
  constructor(private readonly templateStore: CharacterTemplateStore){}

  handle(query: GetUniverseCharacterTemplatesQuery){
    return this.templateStore.loadManyFromUniverse(query.universe)
  }
}