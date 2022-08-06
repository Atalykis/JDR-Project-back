import { Module } from "@nestjs/common";
import { BoardStore } from "../../board/application/board.store";
import { BoardModule } from "../../board/infrastructure/board.module";
import { CharacterStore } from "../../character/application/character.store";
import { CharacterModule } from "../../character/character.module";
import { UserModule } from "../../user/infrastructure/user.module";
import { AddCharacterCommandHandler } from "../application/add-character.command/add-character.command";
import { CreateRoomHandler } from "../application/create-room.command/create-room.command";
import { GetAdventureRoomsQueryHandler } from "../application/get-adventure-rooms.query/get-adventure-rooms.query";
import { GetRoomCharactersHandler } from "../application/get-room-characters.query/get-room-characters.query";
import { GetRoomPlayersHandler } from "../application/get-room-players.query/get-room-players.query";
import { JoinRoomHandler } from "../application/join-room.command/join-room.command";
import { KickPlayerHandler } from "../application/kick-player.command/kick-player.command";
import { LeaveRoomHandler } from "../application/leave-room.command/leave-room.command";
import { RoomStore } from "../application/room.store";
import { RoomController } from "./http/room.controller";
import { RoomResolver } from "./qraphql/room.resolver";
import { RoomStoreInMemory } from "./store/room.store.in-memory";

@Module({
  imports: [UserModule, CharacterModule, BoardModule],
  controllers: [RoomController],
  providers: [
    { provide: "RoomStore", useClass: RoomStoreInMemory },
    {
      provide: CreateRoomHandler,
      useFactory: (roomStore: RoomStore, boardStore: BoardStore) => new CreateRoomHandler(roomStore, boardStore),
      inject: ["RoomStore", "BoardStore"],
    },
    { 
      provide: AddCharacterCommandHandler,
      useFactory: (roomStore: RoomStore, boardStore: BoardStore) => new AddCharacterCommandHandler(roomStore, boardStore),
      inject: ["RoomStore", "BoardStore"] 
    },
    {
      provide: JoinRoomHandler,
      useFactory: (roomStore: RoomStore) => new JoinRoomHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: LeaveRoomHandler,
      useFactory: (roomStore: RoomStore) => new LeaveRoomHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: GetRoomPlayersHandler,
      useFactory: (roomStore: RoomStore) => new GetRoomPlayersHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: KickPlayerHandler,
      useFactory: (roomStore: RoomStore) => new KickPlayerHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: GetRoomCharactersHandler,
      useFactory: (roomStore: RoomStore) => new GetRoomCharactersHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: GetAdventureRoomsQueryHandler,
      useFactory: (roomStore: RoomStore) => new GetAdventureRoomsQueryHandler(roomStore),
      inject: ["RoomStore"],
    },
    RoomResolver,
  ],
})
export class RoomModule {}

// const lol = 'test'
// const obj = { [lol]: true } // { test: true }

// type gender = 'male' | 'female'
// type allowedGendersInTheKitchen = { male: false, female: true }

// type c = {
//   [K in keyof allowedGendersInTheKitchen]: allowedGendersInTheKitchen[K] extends true ? K : never
// }[keyof allowedGendersInTheKitchen]

// type BooleanKeys<Type extends { [key: any]: any }> = { [Key in keyof Type]: Type[Key] extends boolean ? Key : never }[keyof Type]

// type PickBooleans<Type extends { [key: any]: any }> = {
//   [K in BooleanKeys<Type>]: Type[K]
// }}

// type a = PickBooleans<{ coucou: string, lol: number, foo: boolean, bar: boolean }>
// type b = keyof { coucou: true }
// type c = 'foo' | 'bar'

// function provide<T extends new (...args: any[]) => any>(Class: T, params: T extends new (...args: infer Params) => any ? new (...args: any[]) => { [Index in keyof Params]: new (...args: any[]) => Params[Index] } : never): FactoryProvider<T>{
//   return {
//     provide: Class,
//     inject: params,
//     useFactory: (...args: any) => new Class(...args)
//   }
// }

// type lolo = [
//   getRoomCharactersHandler: new (...args: any[]) => GetRoomCharactersHandler,
//   characterStore: new (...args: any[]) => CharacterStore,
//   roomStore: new (...args: any[]) => RoomStore
// ]
// provide(RoomResolver, [GetRoomCharactersHandler, ])
