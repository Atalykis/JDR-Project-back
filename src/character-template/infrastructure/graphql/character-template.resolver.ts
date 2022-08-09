import { ConflictException, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Field, Mutation, Query, ObjectType, Resolver, createUnionType } from "@nestjs/graphql";
import { AuthGuard } from "../../../user/infrastructure/guard/auth.guard";
import { AddCharacteristicCommandHandler, CannotAddCharacteristicInsideNonExistingTemplate } from "../../application/add-characteristic.command/add-characteristic.command";
import { AddStatisticCommandHandler, CannotAddStatisticInsideNonExistingCharacterTemplate } from "../../application/add-statistic.command/add-statistic.command";
import { CannotCreateCharacterTemplateWithAlreadyTakenName, CreateCharacterTemplateCommandHandler } from "../../application/create-character-template.command/create-character-template.command";
import { CannotQueryUnexistingCharacterTemplateError, GetCharacterTemplateQueryHandler } from "../../application/get-character-template.query/get-character-template.query";
import { GetUniverseCharacterTemplatesQueryHandler } from "../../application/get-universe-character-templates.query/get-universe-character-templates";
import { CannotSetCharacteristicInsideNonExistingTemplate, CannotSetValueOfNonExistingCharacteristic, SetCharacteristicValueCommandHandler } from "../../application/set-characteristic-value.command/set-characteristic-value.command";
import { CannotSetStatisticInsideNonExistingTemplate, CannotSetValueOfNonExistingStatistic, SetStatisticValueCommandHandler } from "../../application/set-statistic-value.command/set-statistic-value.command";
import { CannotAddCharacteristicWithAlreadyTakenName, CannotAddStatisticWithAlreadyTakenName, CharacterTemplateId } from "../../domain/character-template";
import { CharacteristicType, CharacterTemplateIdType, CharacterTemplateType, StatisticType } from "./character-template-object-type";

@Resolver()
@UseGuards(AuthGuard)
export class CharacterTemplateResolver {
    constructor(
        private readonly createCharacterTemplateCommandHandler: CreateCharacterTemplateCommandHandler, 
        private readonly getUniverseCharacterTemplatesQueryHandler: GetUniverseCharacterTemplatesQueryHandler,
        private readonly getCharacterTemplateQueryHandler: GetCharacterTemplateQueryHandler,
        private readonly addCharacteristicCommandHandler: AddCharacteristicCommandHandler,
        private readonly setCharacteristicValueCommandHandler: SetCharacteristicValueCommandHandler,
        private readonly addStatisticCommandHandler: AddStatisticCommandHandler,
        private readonly setStatisticValueCommandHandler: SetStatisticValueCommandHandler) {}

    @Query(() => [CharacterTemplateType])
        async universeCharacterTemplates(@Args("universe") universe: string){
            const templates = await this.getUniverseCharacterTemplatesQueryHandler.handle({universe})
        return templates.map((template) => {
            return {
                name: template.name,
                universe: template.universe,
                characteristics: template.fullCharacteristics,
                statistics: template.fullStatistics
            }
        })
    }

    @Query(() => CharacterTemplateType)
    async characterTemplate(@Args("name") name: string, @Args("universe") universe: string){
        try {
            const  template = await this.getCharacterTemplateQueryHandler.handle({name, universe})
            return {
                name: template.name,
                universe: template.universe,
                characteristics: template.fullCharacteristics,
                statistics: template.fullStatistics
            }
        } catch(error) {
            if(error instanceof CannotQueryUnexistingCharacterTemplateError) {
                throw new NotFoundException(error.message)
            }
        }
    }

    @Mutation(() => CharacterTemplateType)
    async createCharacterTemplate(@Args("name") name: string, @Args("universe") universe: string) {
        try {
            await this.createCharacterTemplateCommandHandler.handle({name, universe})
            return this.characterTemplate(name, universe)
        } catch(error) {
            if(error instanceof CannotCreateCharacterTemplateWithAlreadyTakenName) {
                throw new ConflictException(error.message)
            }
        }
    }

    @Mutation(() => CharacterTemplateType)
    async addCharacteristic(@Args("id") id: CharacterTemplateIdType, @Args("characteristic") characteristic: CharacteristicType) {
        try {
            const templateId = new CharacterTemplateId(id.name, id.universe)
            await this.addCharacteristicCommandHandler.handle({
                id: templateId,
                characteristicName: characteristic.name,
                value: characteristic.value
            })
            return this.characterTemplate(id.name, id.universe)
        } catch (error) {
            if(error instanceof CannotAddCharacteristicInsideNonExistingTemplate){
                throw new NotFoundException(error.message)
            }
            if(error instanceof CannotAddCharacteristicWithAlreadyTakenName){
                throw new ConflictException(error.message)
            }
        }
    }

    @Mutation(() => CharacterTemplateType)
    async setCharacteristicValue(@Args("id") id: CharacterTemplateIdType, @Args("characteristic") characteristic: CharacteristicType){
        try{
            const templateId = new CharacterTemplateId(id.name, id.universe)
            await this.setCharacteristicValueCommandHandler.handle({
                id: templateId,
                characteristicName: characteristic.name,
                value: characteristic.value
            })
            return this.characterTemplate(id.name, id.universe)
        } catch (error) {
            if(error instanceof CannotSetCharacteristicInsideNonExistingTemplate){
                throw new NotFoundException(error.message)
            }
            if(error instanceof CannotSetValueOfNonExistingCharacteristic){
                throw new NotFoundException(error.message)
            }
        }
    }

    @Mutation(() => CharacterTemplateType)
    async addStatistic(@Args("id") id: CharacterTemplateIdType, @Args("statistic") statistic: StatisticType) {
        try {
            const templateId = new CharacterTemplateId(id.name, id.universe)
            await this.addStatisticCommandHandler.handle({
                id: templateId,
                statName: statistic.name,
                value: statistic.value
            })
            return this.characterTemplate(id.name, id.universe)
        } catch (error) {
            if(error instanceof CannotAddStatisticInsideNonExistingCharacterTemplate){
                throw new NotFoundException(error.message)
            }
            if(error instanceof CannotAddStatisticWithAlreadyTakenName){
                throw new ConflictException(error.message)
            }
        }
    }

    @Mutation(() => CharacterTemplateType)
    async setStatisticValue(@Args("id") id: CharacterTemplateIdType, @Args("statistic") statistic: StatisticType){
        try{
            const templateId = new CharacterTemplateId(id.name, id.universe)
            await this.setStatisticValueCommandHandler.handle({
                id: templateId,
                statName: statistic.name,
                value: statistic.value
            })
            return this.characterTemplate(id.name, id.universe)
        } catch (error) {
            if(error instanceof CannotSetStatisticInsideNonExistingTemplate){
                throw new NotFoundException(error.message)
            }
            if(error instanceof CannotSetValueOfNonExistingStatistic){
                throw new NotFoundException(error.message)
            }
        }
    }
}