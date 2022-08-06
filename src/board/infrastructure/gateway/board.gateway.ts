import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { from } from "rxjs";
import { Server, Socket } from "socket.io";
import { WatchLineSubscriptionHandler } from "../../application/watch-lines.subscription/watch-lines.subscription";
import { map } from "rxjs/operators";
import { closeable, Queue } from "../../../elies-stream/queue";
import { UseGuards, Inject } from "@nestjs/common";
import { AuthGuard } from "../../../user/infrastructure/guard/auth.guard";
import { TokenManager } from "../../../user/application/token-manager";
import { WatchTokensSubscriptionHandler } from "../../application/watch-token.subscription/watch-token.subscription";
import { Line } from "../../domain/line";
import { Token } from "../../domain/token";
import { combineAsyncIterables } from "../../../utils/combine-async-iterator";
@WebSocketGateway({
  cors: {
    origin: "http://localhost:8080",
  },
})
export class BoardGateway implements OnGatewayConnection {
  constructor(
    private readonly watchLinesSubscriptionHandler: WatchLineSubscriptionHandler,

    private readonly watchTokenSubscriptionHandler: WatchTokensSubscriptionHandler,
    @Inject("TokenManager") public readonly tokenManager: TokenManager
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    const room = (client.handshake.headers.room as string)
    if (!token) {
      // throw new Error("Not authenticated");
      return;
    }
    if (!room) {
      // throw new Error("Invalid Room Header");
      return;
    }

    const username = this.tokenManager.getUsernameFromAccessToken(token);

    const lineQueue = this.watchLinesSubscriptionHandler.handle({ user: username, roomName: room });

    const tokenQueue = this.watchTokenSubscriptionHandler.handle({ author: username, roomName: room });

    const lineClosing = closeable(lineQueue[Symbol.asyncIterator](), async () => {
      lineQueue.close();
    });

    const tokenClosing = closeable(tokenQueue[Symbol.asyncIterator](), async () => {
      tokenQueue.close();
    });

    const merged = combineAsyncIterables<Line | Token>([tokenClosing, lineClosing])
  
      
    for await (const chunck of merged) {
      if (chunck instanceof Token) {
        client.emit("TokenMoved", chunck.serialize());
      } else {
        client.emit("LineAdded", chunck.serialize());
      }
    }


      client.on("disconnect", () => {
        lineClosing.close();
        tokenQueue.close();
      });
    }
  }
  