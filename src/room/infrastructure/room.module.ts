import { Module } from "@nestjs/common";
import { TokenManager } from "../../authentication/application/token-manager";
import { AuthGuard } from "../../authentication/infrastructure/guard/auth.guard";
import { CryptrTokenManager } from "../../authentication/infrastructure/token/crypto.token-manager";
import { UserModule } from "../../authentication/infrastructure/user.module";
import { CreateRoomHandler } from "../application/create-room.command";
import { GetRoomMembersHandler } from "../application/get-room-members.query";
import { JoinRoomHandler } from "../application/join-room.command";
import { LeaveRoomHandler } from "../application/leave-room.command";
import { RoomController } from "./http/room.controller";
import { RoomStore } from "./store/room.store";
import { RoomStoreInMemory } from "./store/room.store.in-memory";

@Module({
  controllers: [RoomController],
  imports: [UserModule],
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
