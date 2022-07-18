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
    if (!token) {
      // throw new Error("Not authenticated");
      return;
    }

    const username = this.tokenManager.getUsernameFromAccessToken(token);

    const lineQueue = this.watchLinesSubscriptionHandler.handle({ user: username, roomName: "TheBizarreRoom" });

    // const tokenQueue = this.watchTokenSubscriptionHandler.handle({ author: username, roomName: "TheBizarreRoom" });

    const lineClosing = closeable(lineQueue[Symbol.asyncIterator](), async () => {
      lineQueue.close();
    });

    // const tokenClosing = closeable(tokenQueue[Symbol.asyncIterator](), async () => {
    //   tokenQueue.close();
    // });

    // const queue = new Queue<Line | Token>();
    // const merged = closeable(queue[Symbol.asyncIterator](), async () => {
    //   queue.close();
    // });

    client.on("disconnect", () => {
      lineClosing.close();
      // tokenQueue.close();
    });

    for await (const line of lineClosing) {
      client.emit("LineAdded", line.serialize());
      // queue.push(line);
    }

    // for await (const token of tokenClosing) {
    //   // client.emit("TokenMoved", token.toObject());
    //   queue.push(token);
    // }

    // for await (const chunck of merged) {
    //   if (typeof chunck === typeof Token) {
    //     client.emit("TokenMoved", chunck.serialize());
    //   } else {
    //     client.emit("LineAdded", chunck.serialize());
    //   }
    // }
  }
}
