import { BoardBuilder } from "../../domain/board.builder";
import { LineFixtures } from "../../domain/line.builder";
import { InMemoryBoardStore } from "../../infrastructure/board-store-in-memory";
import { GetLinesQueryHandler } from "./get-lines.query";

describe("GetLinesQuery", () => {
  const store = new InMemoryBoardStore();
  const handler = new GetLinesQueryHandler(store);

  it("should retrieve all the lines in a board", async () => {
    const board = new BoardBuilder().withRoomName("room-1").addLineAs("blueDash", "Atalykis").addLineAs("redDash", "Atalykis").build();

    await store.save(board);

    const lines = await handler.handle({ roomName: "room-1" });

    expect(lines).toEqual([LineFixtures.blueDash, LineFixtures.redDash]);
  });

  it("should return an empty array if the board does not exist", async () => {
    const lines = await handler.handle({ roomName: "room-none" });

    expect(lines).toEqual([]);
  });
});
