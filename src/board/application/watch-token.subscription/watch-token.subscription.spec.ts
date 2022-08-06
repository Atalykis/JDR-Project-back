import { TokenFixture } from "../../domain/token.builder";
import { EventBus } from "../event-bus";
import { WatchTokensSubscriptionHandler } from "./watch-token.subscription";

describe("WatchTokenSubscription", () => {
  const eventBus = new EventBus();
  const handler = new WatchTokensSubscriptionHandler(eventBus);

  it("should allow to iterate over the moved token of a board", async () => {
    const room = "room-1";
    const tokenWatcher = handler.handle({ roomName: room, author: "Aetherall" });

    eventBus.publish({ type: "TokenMoved", payload: { roomName: room, token: TokenFixture.basic50, author: "Atalykis" } });

    const iterator = tokenWatcher[Symbol.asyncIterator]();
    const next = await iterator.next();

    expect(next.value).toEqual(TokenFixture.basic50);
  });
});
