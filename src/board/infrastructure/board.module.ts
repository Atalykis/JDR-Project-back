import { Module } from "@nestjs/common";
import { TokenManager } from "../../user/application/token-manager";
import { UserModule } from "../../user/infrastructure/user.module";
import { BoardStore } from "../application/board.store";
import { DrawLineCommandHandler } from "../application/draw-line.command/draw-line.command";
import { EventBus } from "../application/event-bus";
import { GetLinesQueryHandler } from "../application/get-lines.query/get-lines.query";
import { MoveTokenCommandHandler } from "../application/move-token.command/move-token.command";
import { WatchLineSubscriptionHandler } from "../application/watch-lines.subscription/watch-lines.subscription";
import { WatchTokensSubscriptionHandler } from "../application/watch-token.subscription/watch-token.subscription";
import { InMemoryBoardStore } from "./board-store-in-memory";
import { BoardGateway } from "./gateway/board.gateway";
import { BoardResolver } from "./graphql/board.resolver";

@Module({
  imports: [UserModule],
  providers: [
    BoardGateway,
    // {
    //   provide: BoardGateway,
    //   useFactory: (watchLineSubscriptionHandler: WatchLineSubscriptionHandler, tokenManager: TokenManager) => {
    //     console.log("BoardGateway Factory", tokenManager);
    //     return new BoardGateway(watchLineSubscriptionHandler, tokenManager);
    //   },
    //   inject: [WatchLineSubscriptionHandler, "TokenManager"],
    // },
    EventBus,
    { provide: BoardStore, useClass: InMemoryBoardStore },
    {
      provide: DrawLineCommandHandler,
      useFactory: (boardStore: BoardStore, eventBus: EventBus) => new DrawLineCommandHandler(boardStore, eventBus),
      inject: [BoardStore, EventBus],
    },
    {
      provide: MoveTokenCommandHandler,
      useFactory: (boardStore: BoardStore, eventBus: EventBus) => new MoveTokenCommandHandler(boardStore, eventBus),
      inject: [BoardStore, EventBus],
    },
    {
      provide: GetLinesQueryHandler,
      useFactory: (boardStore: BoardStore) => new GetLinesQueryHandler(boardStore),
      inject: [BoardStore],
    },
    {
      provide: WatchLineSubscriptionHandler,
      useFactory: (eventBus: EventBus) => new WatchLineSubscriptionHandler(eventBus),
      inject: [EventBus],
    },
    {
      provide: WatchTokensSubscriptionHandler,
      useFactory: (eventBus: EventBus) => new WatchTokensSubscriptionHandler(eventBus),
      inject: [EventBus],
    },
    BoardResolver,
  ],
})
export class BoardModule {}
