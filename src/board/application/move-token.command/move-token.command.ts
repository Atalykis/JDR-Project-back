import { Board } from "../../domain/board";
import { Position, Token } from "../../domain/token";
import { BoardStore } from "../board.store";
import { EventBus } from "../event-bus";

export interface MoveTokenCommand {
  roomName: string;
  token: Token;
  author: string;
}

export class MoveTokenCommandHandler {
  constructor(private boardStore: BoardStore, private readonly eventBus: EventBus) {}

  async handle({ roomName, token, author }: MoveTokenCommand) {
    let board = await this.boardStore.load(roomName);
    if (!board) return;

    const moved = board.moveToken(token, author);
    if (!moved) return;
    await this.boardStore.save(board);

    this.eventBus.publish({ type: "TokenMoved", payload: { roomName, token: moved.token, author } });
    console.log("published token into eventBus");
  }
}
