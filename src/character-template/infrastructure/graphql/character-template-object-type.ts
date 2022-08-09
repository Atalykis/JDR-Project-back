import { Field, InputType, ObjectType } from "@nestjs/graphql"

@InputType('StatisticValueInput')
@ObjectType("StatisticValueType")
export class StatisticValueType{
    @Field()
    min: number

    @Field()
    max: number
}

@InputType("CharacteristicInput")
@ObjectType("CharacteristicType")
export class CharacteristicType{
    @Field()
    name: string

    @Field()
    value: string
}

@InputType("StatisticInput")
@ObjectType("StatisticType")
export class StatisticType{
    @Field()
    name: string

    @Field()
    value: StatisticValueType
}

@ObjectType("CharacterTemplate")
export class CharacterTemplateType {
    @Field()
    name: string

    @Field()
    universe: string

    @Field(() => [CharacteristicType])
    characteristics: typeof CharacteristicType[]

    @Field(() => [StatisticType])
    statistics: StatisticType[]
}

@InputType("CharacterTemplateIdInput")
@ObjectType("CharacterTemplateIdType")
export class CharacterTemplateIdType{
    @Field()
    name: string

    @Field()
    universe: string
}


