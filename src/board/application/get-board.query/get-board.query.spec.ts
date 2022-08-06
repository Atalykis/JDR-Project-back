import { BoardBuilder } from "../../domain/board.builder";
import { LineFixtures } from "../../domain/line.builder";
import { InMemoryBoardStore } from "../../infrastructure/board-store-in-memory";
import { BoardStore } from "../board.store";
import { GetBoardQueryHandler } from "./get-board.query";

describe("GetLinesQuery", () => {
  const store = new InMemoryBoardStore();
  const handler = new GetBoardQueryHandler(store);
1
  it("should retrieve a board", async () => {
    const board = new BoardBuilder().withRoomName("room-1").addLineAs("blueDash", "Atalykis").addLineAs("redDash", "Atalykis").withbasicsTokens().build();

    await store.save(board);

    const loaded = await handler.handle({ roomName: "room-1" });

    expect(loaded).toEqual(board);
  });

});

