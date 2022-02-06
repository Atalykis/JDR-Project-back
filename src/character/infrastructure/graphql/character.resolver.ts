import { Query, Resolver, ObjectType, Field, Args } from "@nestjs/graphql";
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
  @Query(() => [CharacterType])
  characters(@Args("owner") owner: string, @Args("adventure") adventure: string) {
    return this.getCharactersHandler.handle({ owner, adventure });
  }
}
