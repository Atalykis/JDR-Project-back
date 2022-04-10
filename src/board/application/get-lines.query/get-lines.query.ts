import { FixtureOf } from "../../../typings/fixtures";
import { Board } from "../../domain/board";
import { BoardBuilder } from "../../domain/board.builder";
import { Line } from "../../domain/line";
import { LineFixtures } from "../../domain/line.builder";
import { InMemoryBoardStore } from "../../infrastructure/board-store-in-memory";
import { BoardStore } from "../board.store";

interface GetLinesQuery {
  roomName: string;
}
export class GetLinesQueryHandler {
  constructor(private readonly boardStore: BoardStore) {}

  async handle(query: GetLinesQuery) {
    const board = await this.boardStore.load(query.roomName);

    if (!board) {
      return [];
    }

    return board.lines.map((ownedLine) => ownedLine.line);
  }
}
