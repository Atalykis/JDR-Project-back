import { CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface AddCharacteristicCommand {
    id: CharacterTemplateId
    characteristicName: string
    value: string
}

export class AddCharacteristicCommandHandler {
    constructor(private readonly templateStore: CharacterTemplateStore){}

    async handle(command: AddCharacteristicCommand){
        const template = await this.templateStore.load(command.id)
        if(!template) {
            throw new CannotAddCharacteristicInsideNonExistingTemplate(command.id)
        }
        try{
            template.addCharacteristic(command.characteristicName, command.value)
        } catch(error) {
            throw error
        }
    }
}

export class CannotAddCharacteristicInsideNonExistingTemplate extends Error {
    constructor(id: CharacterTemplateId){
        super(`cannot add characteristic inside non existing template ${id.name} of ${id.universe}`)
    }
}