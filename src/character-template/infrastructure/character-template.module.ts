import { Module } from "@nestjs/common";
import { UserModule } from "../../user/infrastructure/user.module";
import { AddCharacteristicCommandHandler } from "../application/add-characteristic.command/add-characteristic.command";
import { AddStatisticCommandHandler } from "../application/add-statistic.command/add-statistic.command";
import { CharacterTemplateStore } from "../application/character-template.store";
import { CreateCharacterTemplateCommandHandler } from "../application/create-character-template.command/create-character-template.command";
import { GetCharacterTemplateQueryHandler } from "../application/get-character-template.query/get-character-template.query";
import { GetUniverseCharacterTemplatesQueryHandler } from "../application/get-universe-character-templates.query/get-universe-character-templates";
import { SetCharacteristicValueCommandHandler } from "../application/set-characteristic-value.command/set-characteristic-value.command";
import { SetStatisticValueCommandHandler } from "../application/set-statistic-value.command/set-statistic-value.command";
import { CharacterTemplateStoreInMemory } from "./character-template.store.in-memory";
import { CharacterTemplateResolver } from "./graphql/character-template.resolver";

@Module({
    imports: [UserModule],
    providers: [
        {   provide: "CharacterTemplateStore", useClass: CharacterTemplateStoreInMemory },
        {
            provide: CreateCharacterTemplateCommandHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new CreateCharacterTemplateCommandHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: GetUniverseCharacterTemplatesQueryHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new GetUniverseCharacterTemplatesQueryHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: GetCharacterTemplateQueryHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new GetCharacterTemplateQueryHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: AddCharacteristicCommandHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new AddCharacteristicCommandHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: SetCharacteristicValueCommandHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new SetCharacteristicValueCommandHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: AddStatisticCommandHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new AddStatisticCommandHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        {
            provide: SetStatisticValueCommandHandler,
            useFactory: (templateStore: CharacterTemplateStore) => new SetStatisticValueCommandHandler(templateStore),
            inject: ["CharacterTemplateStore"]
        },
        CharacterTemplateResolver
    ]
})
export class CharacterTemplateModule {}