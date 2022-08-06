import { Board } from "../../domain/board";
import { BoardBuilder } from "../../domain/board.builder";
import { Position, Token } from "../../domain/token";
import { TokenFixture } from "../../domain/token.builder";
import { InMemoryBoardStore } from "../../infrastructure/board-store-in-memory";
import { BoardStore } from "../board.store";
import { EventBus } from "../event-bus";
import { MoveTokenCommandHandler } from "./move-token.command";

describe("draw line command", () => {
  const store = new InMemoryBoardStore();
  const eventBus = new EventBus();
  const handler = new MoveTokenCommandHandler(store, eventBus);
  it("should allow a user to move his token on the board", async () => {
    const author = "Atalykis";

    const token = TokenFixture.basic50;
    const board = new BoardBuilder().withRoomName("room-1").build();
    board.tokens.push({ token, owner: "Atalykis" });
    store.save(board);
    const movedToken = TokenFixture.basic50
    movedToken.move(new Position({x: 100, y:100}))

    await handler.handle({ roomName: board.roomName, token: movedToken, author });

    const saved = await store.load("room-1");

    const [first] = saved!.tokens;

    expect(first.token.pos.serialize()).toEqual({ x: 100, y: 100 });
  });
});
