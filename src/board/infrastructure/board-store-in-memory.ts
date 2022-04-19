import { OnModuleInit } from "@nestjs/common";
import { BoardStore } from "../application/board.store";
import { Board } from "../domain/board";
import { BoardBuilder } from "../domain/board.builder";

export class InMemoryBoardStore extends BoardStore implements OnModuleInit {
  boards = new Map<string, Board>();

  async init() {
    await this.boards.clear();
    const board = new BoardBuilder().withRoomName("TheBizarreRoom").addLineAs("redDiagonal", "Atalykis").addLineAs("greenSquare", "Atalykis").build();
    await this.save(board);
  }

  async onModuleInit() {
    await this.init();
  }

  async load(roomName: string) {
    return this.boards.get(roomName);
  }

  async save(board: Board) {
    this.boards.set(board.roomName, board);
  }
}
