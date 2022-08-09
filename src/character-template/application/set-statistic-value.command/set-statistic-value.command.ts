import { CharacterTemplateId, StatisticValue } from "../../domain/character-template"
import { CharacterTemplateStore } from "../character-template.store"

export interface SetStatisticValueCommand {
    id: CharacterTemplateId
    statName: string
    value: StatisticValue
}

export class SetStatisticValueCommandHandler{
    constructor(private readonly templateStore: CharacterTemplateStore){}

    async handle(command: SetStatisticValueCommand){
        const template = await this.templateStore.load(command.id)
        if(!template){
            throw new CannotSetStatisticInsideNonExistingTemplate(command.id)
        }
        if(!template.hasStatistic(command.statName)){
            throw new CannotSetValueOfNonExistingStatistic(command.statName)
        }
        template.setStatistic(command.statName, command.value)
    }
}

export class CannotSetStatisticInsideNonExistingTemplate extends Error{
    constructor(id: CharacterTemplateId){
        super(`cannot set statistic of non existing character template ${id.name} of ${id.universe}`)
    }
}

export class CannotSetValueOfNonExistingStatistic extends Error{
    constructor(name: string){
        super(`cannot set value of non existing statistic ${name}`)
    }
}