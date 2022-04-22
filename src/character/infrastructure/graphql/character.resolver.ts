import { UseGuards } from "@nestjs/common";
import { Query, Resolver, ObjectType, Field, Args, InputType, Mutation } from "@nestjs/graphql";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CreateCharacterHandler } from "../../application/create-character.command/create-character.comand";
import { GetCharacterHandler } from "../../application/get-character.query /get-character.query";
import { GetCharactersHandler } from "../../application/get-characters.query/get-characters.query";
import { CharacterIdentity } from "../../domain/character";

@ObjectType("Character")
export class CharacterType {
  @Field()
  name: string;

  @Field()
  owner: string;

  @Field()
  adventure: string;

  @Field()
  description: string;
}

@Resolver()
@UseGuards(AuthGuard)
export class CharacterResolver {
  constructor(
    private readonly getCharactersHandler: GetCharactersHandler,
    private readonly getCharacterHandler: GetCharacterHandler,
    private readonly createCharacterHandler: CreateCharacterHandler
  ) {}
  @Query(() => [CharacterType])
  async characters(@Username() owner: string, @Args("adventure") adventure: string) {
    return await this.getCharactersHandler.handle({ owner, adventure });
  }

  @Query(() => CharacterType)
  async character(@Username() owner: string, @Args("name") name: string, @Args("adventure") adventure: string) {
    const identity = new CharacterIdentity(name, owner, adventure);
    return await this.getCharacterHandler.handle({ character: identity });
  }

  @Mutation(() => CharacterType)
  async createCharacter(
    @Username() owner: string,
    @Args("name") name: string,
    @Args("adventure") adventure: string,
    @Args("description") description: string
  ) {
    await this.createCharacterHandler.handle({ name, user: owner, adventure, description });
    return this.character(owner, name, adventure);
  }
}
