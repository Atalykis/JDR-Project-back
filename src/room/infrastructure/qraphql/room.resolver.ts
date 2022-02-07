import { Inject, UseGuards } from "@nestjs/common";
import { Query, Resolver, ObjectType, Field, Args, Parent, ResolveField } from "@nestjs/graphql";
import { CharacterStore } from "../../../character/application/character.store";
import { CharacterResolver, CharacterType } from "../../../character/infrastructure/graphql/character.resolver";
import { AuthGuard } from "../../../user/infrastructure/guard/auth.guard";
import { GetRoomCharactersHandler } from "../../application/get-room-characters.query/get-room-characters.query";
import { RoomStore } from "../../application/room.store";

@ObjectType("Room")
class RoomType {
  @Field()
  name: string;

  @Field()
  gm: string;

  @Field()
  adventure: string;
}

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(
    private readonly getRoomCharactersHandler: GetRoomCharactersHandler,
    @Inject("CharacterStore") private readonly characterStore: CharacterStore,
    @Inject("RoomStore") private readonly roomStore: RoomStore
  ) {}

  @Query(() => RoomType)
  room(@Args("name") name: string) {
    return this.roomStore.load(name);
  }
  @ResolveField(() => [CharacterType])
  async characters(@Parent() room: RoomType) {
    const characterIds = await this.getRoomCharactersHandler.handle({ room: room.name });
    return this.characterStore.loadMany(characterIds);
  }
}
