import { UseGuards } from "@nestjs/common";
import { Field, ObjectType, Resolver, Query } from "@nestjs/graphql";
import { AuthGuard } from "../../../user/infrastructure/guard/auth.guard";
import { GetAdventuresQueryHandler } from "../../application/get-adventures-query/get-adventures.query";

@ObjectType("Adventure")
class AdventureType {
  @Field()
  name: string;

  @Field()
  gm: string;
}

@Resolver()
export class AdventureResolver {
  constructor(private readonly getAdventureQueryHandler: GetAdventuresQueryHandler) {}

  @UseGuards(AuthGuard)
  @Query(() => [AdventureType])
  async adventures(): Promise<AdventureType[]> {
    const adventures = await this.getAdventureQueryHandler.handle({});
    return adventures;
  }
}
