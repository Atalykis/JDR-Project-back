import { CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface GetCharacterTemplateQuery{
  name: string
  universe: string
}

export class GetCharacterTemplateQueryHandler{
  constructor(private readonly templateStore: CharacterTemplateStore){}

  async handle(query: GetCharacterTemplateQuery){
    const characterTemplateId = new CharacterTemplateId(query.name, query.universe)
    const loaded = await this.templateStore.load(characterTemplateId)
    if(!loaded){
      throw new CannotQueryUnexistingCharacterTemplateError(query.name)
    }
    return loaded
  }
}

export class CannotQueryUnexistingCharacterTemplateError extends Error {
  constructor(name:string){
    super(`cannot query unexisting character template : ${name}`)
  }
}