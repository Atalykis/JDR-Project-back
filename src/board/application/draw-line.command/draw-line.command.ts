import { Board } from "../../domain/board";
import { Line } from "../../domain/line";
import { BoardStore } from "../board.store";
import { EventBus } from "../event-bus";

interface DrawLineCommand {
  roomName: string;
  line: Line;
  author: string;
}

export class DrawLineCommandHandler {
  constructor(private boardStore: BoardStore, private readonly eventBus: EventBus) {}

  async handle({ roomName, line, author }: DrawLineCommand) {
    let board = await this.boardStore.load(roomName);
    if (!board) {
      board = new Board(roomName);
    }
    board.drawLine(line, author);
    await this.boardStore.save(board);
    this.eventBus.publish({ type: "LineAdded", payload: { roomName, line, author } });
    console.log("published line into eventBus");
  }
}
