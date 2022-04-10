import { Line } from "../../domain/line";
import { LineFixtures } from "../../domain/line.builder";
import { InMemoryBoardStore } from "../../infrastructure/board-store-in-memory";
import { EventBus } from "../event-bus";
import { DrawLineCommandHandler } from "./draw-line.command";

describe("DrawLineCommand", () => {
  const store = new InMemoryBoardStore();
  const eventBus = new EventBus();
  const handler = new DrawLineCommandHandler(store, eventBus);

  it("should allow a user to add a line to the board", async () => {
    const roomName = "room-1";
    const author = "Atalykis";

    const line = LineFixtures.redDiagonal;

    await handler.handle({ roomName, line, author });

    const board = await store.load(roomName);

    const [first] = board!.lines;

    expect(first).toEqual({ line: line, author: author });
    expect(first.author).toEqual("Atalykis");
  });
});
