import { ConflictException, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Field, Mutation, ObjectType, Resolver, Query } from "@nestjs/graphql";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CannotCreateUniverseWithAlreadyTakenNameError, CreateUniverseCommandHandler } from "../../application/create-universe.command/create-universe.command";
import { GetOwnedUniversesQueryHandler } from "../../application/get-owned-universes.query/get-owned-universes.query";
import { CannotRetrieveNonExistingUniverseError, GetUniverseQueryHandler } from "../../application/get-universe.query/get-universe.query";

@ObjectType("Universe")
class UniverseType {
  @Field()
  name: string;

  @Field()
  owner: string;
}

@Resolver()
@UseGuards(AuthGuard)
export class UniverseResolver {
  constructor(
    private readonly createUniverseCommandHandler: CreateUniverseCommandHandler,
    private readonly getUniverseQueryHandler: GetUniverseQueryHandler,
    private readonly getOwnedUniversesQueryHandler: GetOwnedUniversesQueryHandler
    ){}

  @Query(() => UniverseType)
  async universe(@Args('name') name: string) {
    try{
      const universe = await this.getUniverseQueryHandler.handle({name})
      return universe
    } catch(error) {
      if(error instanceof CannotRetrieveNonExistingUniverseError){
        throw new NotFoundException(error.message)
      }
    }
  }

  @Query(() => [UniverseType])
  async ownedUniverses(@Username() owner: string) {
    const universes = await this.getOwnedUniversesQueryHandler.handle({owner})
    return universes
  }

  @Mutation(() => UniverseType)
  async createUniverse(@Args("name") name: string, @Username() owner: string){
    try {
      await this.createUniverseCommandHandler.handle({name, owner})
      return {
        name: name,
        owner: owner,
      }
    } catch (error) {
      if(error instanceof CannotCreateUniverseWithAlreadyTakenNameError){
        throw new ConflictException(error.message)
      }
    }
  }
}