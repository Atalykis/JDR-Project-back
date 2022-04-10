export type Event = { type: string; payload?: any };

type Handler = (event: Event) => void;

export class EventBus {
  listeners = new Map<string, Set<Handler>>();

  on(eventType: string, handler: (payload: any) => void) {
    const handlers = this.listeners.get(eventType);
    if (!handlers) {
      this.listeners.set(eventType, new Set([handler]));
    } else {
      handlers.add(handler);
    }
  }

  off(eventType: string, handler: (payload: any) => void) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  publish(event: Event) {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }
}
