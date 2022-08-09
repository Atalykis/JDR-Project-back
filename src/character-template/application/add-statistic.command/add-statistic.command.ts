import { CharacterTemplateId, StatisticValue } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface AddStatisticCommand {
    id: CharacterTemplateId
    statName: string
    value: StatisticValue
}

export class AddStatisticCommandHandler {
    constructor(private readonly templateStore: CharacterTemplateStore){}

    async handle(command: AddStatisticCommand){
        const template = await this.templateStore.load(command.id)
        if(!template){
            throw new CannotAddStatisticInsideNonExistingCharacterTemplate(command.id)
        }
        try {
            template.addStatistic(command.statName, command.value)
        } catch(error) {
            throw error
        }
        
    }
}

export class CannotAddStatisticInsideNonExistingCharacterTemplate extends Error{
    constructor(id: CharacterTemplateId){
        super(`cannot add statistic inside non existing character template ${id.name} of ${id.universe}`)
    }
}