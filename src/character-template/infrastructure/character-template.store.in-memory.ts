import { CharacterTemplateStore } from "../application/character-template.store"
import { CharacterTemplate, CharacterTemplateId } from "../domain/character-template"
import { CharacterTemplateFixture } from "../domain/character-template.fixture"

export class CharacterTemplateStoreInMemory implements CharacterTemplateStore{
    characterTemplates: CharacterTemplate[] = []

    async save(template: CharacterTemplate){
        this.characterTemplates.push(template)
    }

    async load(id: CharacterTemplateId){
        const template = this.characterTemplates.find((template) => template.id.equals(id))
        if(!template) return
        return template
    }

    async loadManyFromUniverse(universe: string): Promise<CharacterTemplate[]> {
        return this.characterTemplates.filter((template) => template.universe === universe)
    }

    clear(){
        this.characterTemplates = []
    }
}