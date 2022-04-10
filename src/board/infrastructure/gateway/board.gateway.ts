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
import { closeable } from "../../../elies-stream/queue";
import { UseGuards, Inject } from "@nestjs/common";
import { AuthGuard } from "../../../user/infrastructure/guard/auth.guard";
import { TokenManager } from "../../../user/application/token-manager";
@WebSocketGateway({
  cors: {
    origin: "http://localhost:8080",
  },
})
export class BoardGateway implements OnGatewayConnection {
  constructor(
    private readonly watchLinesSubscriptionHandler: WatchLineSubscriptionHandler,
    @Inject("TokenManager") public readonly tokenManager: TokenManager
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake.headers);

    const token = client.handshake.headers.authorization;
    if (!token) {
      throw new Error("Not authenticated");
    }

    const username = this.tokenManager.getUsernameFromAccessToken(token);

    console.log(username);

    const queue = this.watchLinesSubscriptionHandler.handle({ user: username, roomName: "TheBizarreRoom" });

    const closing = closeable(queue[Symbol.asyncIterator](), async () => {
      queue.close();
    });

    client.on("disconnect", () => {
      closing.close();
    });

    for await (const line of closing) {
      client.emit("LineAdded", line.serialize());
    }
  }
}
