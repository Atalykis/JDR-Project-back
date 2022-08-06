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
