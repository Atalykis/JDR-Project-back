import { UseGuards } from "@nestjs/common";
import { Field, ObjectType, Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CreateAdventureHandler } from "../../application/create-adventure.command/create-adventure.command";
import { GetAdventureQueryHandler } from "../../application/get-adventure.query/get-adventure.query";
import { GetAdventuresQueryHandler } from "../../application/get-adventures-query/get-adventures.query";

@ObjectType("Adventure")
class AdventureType {
  @Field()
  name: string;

  @Field()
  gm: string;
}

@Resolver()
@UseGuards(AuthGuard)
export class AdventureResolver {
  constructor(
    private readonly getAdventureQueryHandler: GetAdventureQueryHandler,
    private readonly getAdventuresQueryHandler: GetAdventuresQueryHandler,
    private readonly createAdventureHandler: CreateAdventureHandler
  ) {}

  @Query(() => AdventureType)
  async adventure(@Args("name") name: string): Promise<AdventureType> {
    const adventure = await this.getAdventureQueryHandler.handle({ name });
    return adventure;
  }

  @Query(() => [AdventureType])
  async adventures(): Promise<AdventureType[]> {
    const adventures = await this.getAdventuresQueryHandler.handle({});
    return adventures;
  }

  @Mutation(() => AdventureType)
  async createAdventure(@Args("name") name: string, @Username() gm: string): Promise<AdventureType> {
    await this.createAdventureHandler.handle({ name, gm });
    return this.adventure(name);
  }
}
