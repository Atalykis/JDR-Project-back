import { CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface SetCharacteristicValueCommand {
    id: CharacterTemplateId
    characteristicName: string
    value: string
}

export class SetCharacteristicValueCommandHandler{
    constructor(private readonly templateStore: CharacterTemplateStore){}

    async handle(command: SetCharacteristicValueCommand){
        const template = await this.templateStore.load(command.id)
        if(!template) {
            throw new CannotSetCharacteristicInsideNonExistingTemplate(command.id)
        }
        if(!template.hasCharacteristic(command.characteristicName)){
            throw new CannotSetValueOfNonExistingCharacteristic(command.characteristicName)
        }
        template.setCharacteristic(command.characteristicName, command.value)
        this.templateStore.save(template)
    }
}

export class CannotSetCharacteristicInsideNonExistingTemplate extends Error{
    constructor(id: CharacterTemplateId){
        super(`cannot set characteristic of non existing character template ${id.name} of ${id.universe}`)
    }
}

export class CannotSetValueOfNonExistingCharacteristic extends Error{
    constructor(name: string){
        super(`cannot set value of non existing characteristic ${name}`)
    }
}