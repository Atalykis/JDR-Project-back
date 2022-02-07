import { UseGuards } from "@nestjs/common";
import { Query, Resolver, ObjectType, Field, Args } from "@nestjs/graphql";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { GetCharactersHandler } from "../../application/get-characters.query/get-characters.query";

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
export class CharacterResolver {
  constructor(private readonly getCharactersHandler: GetCharactersHandler) {}
  @UseGuards(AuthGuard)
  @Query(() => [CharacterType])
  characters(@Username() owner: string, @Args("adventure") adventure: string) {
    return this.getCharactersHandler.handle({ owner, adventure });
  }
}
