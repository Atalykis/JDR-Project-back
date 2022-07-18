import { Queue } from "../../../elies-stream/queue";
import { Token } from "../../domain/token";
import { EventBus, Event } from "../event-bus";

interface WatchTokensSubscription {
  roomName: string;
  author: string;
}

export class WatchTokensSubscriptionHandler {
  constructor(private readonly eventBus: EventBus) {}

  handle(subscription: WatchTokensSubscription) {
    const queue = new Queue<Token>();
    const handler = (event: Event) => {
      if (subscription.roomName !== event.payload.roomName) return;
      if (subscription.author === event.payload.author) return;
      console.log("pushing token into queue");
      queue.push(event.payload.token);
    };

    this.eventBus.on("TokenMoved", handler);

    queue.onClose = () => {
      console.log("close queue");
      this.eventBus.off("TokenMoved", handler);
    };

    return queue;
  }
}
