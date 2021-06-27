import { Module } from "@nestjs/common";
import { TokenManager } from "../../authentication/application/token-manager";
import { AuthGuard } from "../../authentication/infrastructure/guard/auth.guard";
import { CryptrTokenManager } from "../../authentication/infrastructure/token/crypto.token-manager";
import { UserModule } from "../../authentication/infrastructure/user.module";
import { CreateRoomHandler } from "../application/create-room.command";
import { GetRoomPlayersHandler } from "../application/get-room-players.query";
import { JoinRoomHandler } from "../application/join-room.command";
import { KickPlayerHandler } from "../application/kick-player.command";
import { LeaveRoomHandler } from "../application/leave-room.command";
import { RoomController } from "./http/room.controller";
import { RoomStore } from "./store/room.store";
import { RoomStoreInMemory } from "./store/room.store.in-memory";

@Module({
  imports: [UserModule],
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
      provide: GetRoomPlayersHandler,
      useFactory: (roomStore: RoomStore) => new GetRoomPlayersHandler(roomStore),
      inject: ["RoomStore"],
    },
    {
      provide: KickPlayerHandler,
      useFactory: (roomStore: RoomStore) => new KickPlayerHandler(roomStore),
      inject: ["RoomStore"],
    },
  ],
})
export class RoomModule {}
