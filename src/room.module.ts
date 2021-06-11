import { Module } from "@nestjs/common";
import { CreateRoomHandler } from "./application/create-room.command";
import { GetRoomMembersHandler } from "./application/get-room-members.query";
import { JoinRoomHandler } from "./application/join-room.command";
import { LeaveRoomHandler } from "./application/leave-room.command";
import { RoomStore } from "./application/room.store";
import { RoomController } from "./infrastructure/http/room.controller";
import { RoomStoreInMemory } from "./infrastructure/room.store.in-memory";

@Module({
  controllers: [RoomController],
  providers: [
    { provide: "RoomStore", useClass: RoomStoreInMemory },
    {
      provide: CreateRoomHandler,
      useFactory: (roomStore: RoomStore) => new CreateRoomHandler(roomStore),
      inject: ["RoomStore"],
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
      provide: GetRoomMembersHandler,
      useFactory: (roomStore: RoomStore) => new GetRoomMembersHandler(roomStore),
      inject: ["RoomStore"],
    },
  ],
})
export class RoomModule {}
