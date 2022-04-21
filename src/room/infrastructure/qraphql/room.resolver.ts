import { ForbiddenException, Inject, NotFoundException, UseGuards } from "@nestjs/common";
import { Query, Resolver, ObjectType, Field, Args, Parent, ResolveField, Mutation, InputType } from "@nestjs/graphql";
import { CharacterStore } from "../../../character/application/character.store";
import { CharacterIdentity } from "../../../character/domain/character";
import { CharacterType } from "../../../character/infrastructure/graphql/character.resolver";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CreateRoomHandler } from "../../application/create-room.command/create-room.command";
import { GetAdventureRoomsQueryHandler } from "../../application/get-adventure-rooms.query/get-adventure-rooms.query";
import { GetRoomCharactersHandler } from "../../application/get-room-characters.query/get-room-characters.query";
import { GetRoomPlayersHandler } from "../../application/get-room-players.query/get-room-players.query";
import { JoinRoomHandler } from "../../application/join-room.command/join-room.command";
import { KickPlayerHandler } from "../../application/kick-player.command/kick-player.command";
import {
  CannotLeaveUnexistingRoomError,
  CannotLeaveUnjoinedRoomError,
  LeaveRoomHandler,
} from "../../application/leave-room.command/leave-room.command";
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
    private readonly leaveRoomHandler: LeaveRoomHandler,
    private readonly getRoomPlayersHandler: GetRoomPlayersHandler,
    private readonly getRoomCharactersHandler: GetRoomCharactersHandler,
    private readonly kickPlayerHandler: KickPlayerHandler,

    private readonly getAdventureRoomsQueryHandler: GetAdventureRoomsQueryHandler,
    @Inject("CharacterStore") private readonly characterStore: CharacterStore,
    @Inject("RoomStore") private readonly roomStore: RoomStore
  ) {}

  @ResolveField(() => [CharacterType])
  async characters(@Parent() room: RoomType) {
    const characterIds = await this.getRoomCharactersHandler.handle({ room: room.name });
    return this.characterStore.loadMany(characterIds);
  }

  @ResolveField(() => [String])
  async members(@Parent() room: RoomType) {
    const members = await this.getRoomPlayersHandler.handle({ room: room.name });
    return members;
  }

  @Query(() => RoomType, { nullable: true })
  room(@Args("name") name: string) {
    return this.roomStore.load(name);
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

  @Mutation(() => RoomType)
  async leaveRoom(@Username() user: string, @Args("room") room: string) {
    await this.leaveRoomHandler.handle({ room, user });
    return this.room(room);
  }

  @Mutation(() => RoomType)
  async kickPlayer(@Username() originator: string, @Args("room") room: string, @Args("player") player: string) {
    await this.kickPlayerHandler.handle({ player, room, originator });
    return this.room(room);
  }
}
