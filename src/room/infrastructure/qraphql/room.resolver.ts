import { Inject, UseGuards } from "@nestjs/common";
import { Query, Resolver, ObjectType, Field, Args, Parent, ResolveField, Mutation, InputType } from "@nestjs/graphql";
import { CharacterStore } from "../../../character/application/character.store";
import { CharacterIdentity } from "../../../character/domain/character";
import { CharacterType } from "../../../character/infrastructure/graphql/character.resolver";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CreateRoomHandler } from "../../application/create-room.command/create-room.command";
import { GetAdventureRoomsQueryHandler } from "../../application/get-adventure-rooms.query/get-adventure-rooms.query";
import { GetRoomCharactersHandler } from "../../application/get-room-characters.query/get-room-characters.query";
import { JoinRoomHandler } from "../../application/join-room.command/join-room.command";
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

@InputType("CharacterInput")
class CharacterInput {
  @Field()
  name: string;

  @Field()
  owner: string;

  @Field()
  adventure: string;
}

@UseGuards(AuthGuard)
@Resolver(() => RoomType)
export class RoomResolver {
  constructor(
    private readonly createRoomHandler: CreateRoomHandler,
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly getRoomCharactersHandler: GetRoomCharactersHandler,

    private readonly getAdventureRoomsQueryHandler: GetAdventureRoomsQueryHandler,
    @Inject("CharacterStore") private readonly characterStore: CharacterStore,
    @Inject("RoomStore") private readonly roomStore: RoomStore
  ) {}

  @Query(() => RoomType, { nullable: true })
  room(@Args("name") name: string) {
    return this.roomStore.load(name);
  }

  @ResolveField(() => [CharacterType])
  async characters(@Parent() room: RoomType) {
    const characterIds = await this.getRoomCharactersHandler.handle({ room: room.name });
    return this.characterStore.loadMany(characterIds);
  }

  @Query(() => [RoomType])
  async rooms(@Args("adventure") adventure: string) {
    const rooms = await this.getAdventureRoomsQueryHandler.handle({ adventure: adventure });
    return rooms;
  }

  @Mutation(() => RoomType)
  async createRoom(@Args("name") name: string, @Args("adventure") adventure: string, @Username() gm: string) {
    await this.createRoomHandler.handle({ name, gm, adventure });
    return this.room(name);
  }

  @Mutation(() => RoomType)
  async joinRoom(@Username() user: string, @Args("room") room: string, @Args("character") character: CharacterInput) {
    const characterIdentity = new CharacterIdentity(character.name, character.owner, character.adventure);
    await this.joinRoomHandler.handle({ room, user, character: characterIdentity });
    return this.room(room);
  }
}

/**
 * mutation JoinRoom($room: String!, $character: CharacterType!) {
 *  joinRoom(room: $room, character: $character) {
 *   name
 *   characters {
 *     name
 *   }
 *  }
 * }
 *
 */
