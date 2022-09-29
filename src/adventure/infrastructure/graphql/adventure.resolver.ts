import { ConflictException, NotFoundException, UseGuards } from "@nestjs/common";
import { Field, ObjectType, Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import {
  CannotCreateAdventureWithAlreadyTakenNameError,
  CreateAdventureHandler,
} from "../../application/create-adventure.command/create-adventure.command";
import { CannotRetrieveNonExistingAdventureError, GetAdventureQueryHandler } from "../../application/get-adventure.query/get-adventure.query";
import { GetAdventuresQueryHandler } from "../../application/get-adventures-query/get-adventures.query";
import { GetOwnedAdventuresQueryHandler } from "../../application/get-owned-adventures.query/get-owned-adventures.query";

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
    private readonly createAdventureHandler: CreateAdventureHandler,
    private readonly getOwnedAdventuresQueryHandler: GetOwnedAdventuresQueryHandler
  ) {}

  @Query(() => AdventureType)
  async adventure(@Args("name") name: string) {
    try {
      const adventure = await this.getAdventureQueryHandler.handle({ name });
      return adventure;
    } catch (error) {
      if (error instanceof CannotRetrieveNonExistingAdventureError) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Query(() => [AdventureType])
  async adventures(): Promise<AdventureType[]> {
    const adventures = await this.getAdventuresQueryHandler.handle({});
    return adventures;
  }

  @Query(() => [AdventureType])
  async ownedAdventures(@Username() gm: string): Promise<AdventureType[]> {
    const adventures = await this.getOwnedAdventuresQueryHandler.handle({ gm })
    return adventures
  }

  @Mutation(() => AdventureType)
  async createAdventure(@Args("name") name: string, @Username() gm: string) {
    try {
      await this.createAdventureHandler.handle({ name, gm });
      return this.adventure(name);
    } catch (error) {
      if (error instanceof CannotCreateAdventureWithAlreadyTakenNameError) {
        throw new ConflictException(error.message);
      }
    }
  }
}
