import { CharacterTemplate, CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface CreateCharacterTemplateCommand {
    name: string,
    universe: string,

}


export class CreateCharacterTemplateCommandHandler {
    constructor(private readonly templateStore: CharacterTemplateStore){}

    async handle(command: CreateCharacterTemplateCommand){
        const existing = await this.templateStore.load(new CharacterTemplateId(command.name, command.universe))
        if(existing){
            throw new CannotCreateCharacterTemplateWithAlreadyTakenName(command.name, command.universe)
        }
        const template = new CharacterTemplate(command.name, command.universe)
        await this.templateStore.save(template)
    }
}

export class CannotCreateCharacterTemplateWithAlreadyTakenName extends Error {
    constructor(name: string, universe: string){
        super(`could not create character template with already taken name ${name} in the universe ${universe}`)
    }
}