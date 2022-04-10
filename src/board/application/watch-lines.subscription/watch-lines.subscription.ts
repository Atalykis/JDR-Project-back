import { Queue } from "../../../elies-stream/queue";
import { Line } from "../../domain/line";
import { EventBus, Event } from "../event-bus";

export interface WatchLineSubscription {
  roomName: string;
  user: string;
}

export class WatchLineSubscriptionHandler {
  constructor(private eventBus: EventBus) {}

  handle(subscription: WatchLineSubscription) {
    const queue = new Queue<Line>();

    const handler = (event: Event) => {
      if (subscription.roomName !== event.payload.roomName) return;
      if (subscription.user === event.payload.author) return;
      console.log("pushing line into queue");
      queue.push(event.payload.line);
    };

    this.eventBus.on("LineAdded", handler);

    queue.onClose = () => {
      console.log("close queue");
      this.eventBus.off("LineAdded", handler);
    };

    return queue;
  }
}
