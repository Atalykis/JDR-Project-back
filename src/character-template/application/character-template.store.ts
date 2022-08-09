import { CharacterTemplate, CharacterTemplateId } from "../domain/character-template"

export interface CharacterTemplateStore {
    save(template: CharacterTemplate): Promise<void>
    load(id: CharacterTemplateId): Promise<CharacterTemplate | undefined>
    loadManyFromUniverse(universe: string): Promise<CharacterTemplate[]>
    clear(): void
}