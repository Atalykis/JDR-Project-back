import { Queue } from "../../../elies-stream/queue";
import { BoardBuilder } from "../../domain/board.builder";
import { LineFixtures } from "../../domain/line.builder";
import { EventBus, Event } from "../event-bus";
import { WatchLineSubscriptionHandler } from "./watch-lines.subscription";

describe("WatchLineSubscription", () => {
  const eventBus = new EventBus();
  const handler = new WatchLineSubscriptionHandler(eventBus);

  it("should allow to iterate over the new lines of a board", async () => {
    const lineWatcher = await handler.handle({ roomName: "room", user: "Atalykis" });

    eventBus.publish({ type: "LineAdded", payload: { roomName: "room", line: LineFixtures.redCross, author: "Aetherall" } });

    const iterator = lineWatcher[Symbol.asyncIterator]();
    const next = await iterator.next();

    expect(next.value).toEqual(LineFixtures.redCross);
  });

  it("should only iterate over the lines of the board that the user is watching", async () => {
    const lineWatcher = await handler.handle({ roomName: "room-1", user: "Atalykis" });

    eventBus.publish({ type: "LineAdded", payload: { roomName: "room-2", line: LineFixtures.redDash, author: "Aetherall" } });
    eventBus.publish({ type: "LineAdded", payload: { roomName: "room-1", line: LineFixtures.blueDash, author: "Aetherall" } });

    const iterator = lineWatcher[Symbol.asyncIterator]();
    const next = await iterator.next();
    expect(next.value).toEqual(LineFixtures.blueDash);
  });

  it("shouldn't iterate over user's line", async () => {
    const lineWatcher = await handler.handle({ roomName: "room-1", user: "Atalykis" });

    eventBus.publish({ type: "LineAdded", payload: { roomName: "room-1", line: LineFixtures.blueDash, author: "Aetherall" } });
    eventBus.publish({ type: "LineAdded", payload: { roomName: "room-1", line: LineFixtures.redDash, author: "Atalykis" } });
    eventBus.publish({ type: "LineAdded", payload: { roomName: "room-1", line: LineFixtures.greenSquare, author: "Aetherall" } });

    const iterator = lineWatcher[Symbol.asyncIterator]();
    const first = await iterator.next();
    expect(first.value).toEqual(LineFixtures.blueDash);
    const second = await iterator.next();
    expect(second.value).toEqual(LineFixtures.greenSquare);
  });
});
