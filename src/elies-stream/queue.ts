let queueId = 0;

function loggable(value: unknown) {
  if (typeof value === "object" && value !== null && "serialize" in value) {
    return (value as any).serialize();
  }

  return value;
}

export function closeable<T, U>(
  iterable: AsyncIterableIterator<T>,
  onClose?: () => Promise<void>
): AsyncIterableIterator<T> & { close: () => Promise<void> } {
  const resolves = new Set<(value: unknown) => void>();
  let done = false;

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (done) {
        return { done: done };
      }

      let resolve: (value: unknown) => void;

      const next = new Promise((r) => {
        resolve = r;
        resolves.add(r);
      });

      const defer = iterable.next();

      defer.then(({ done, value }) => {
        resolves.delete(resolve);
        resolve({ done, value });
      });

      return next;
    },
    close() {
      done = true;
      for (const r of resolves) {
        r({ done: true });
      }
      return onClose?.();
    },
  } as any;
}

export class Queue<T> {
  private pullQueue: Array<(value: T) => void> = [];
  private pushQueue: Array<Promise<T>> = [];
  private isClosed = false;

  public onClose = () => {};

  private queueId: number;
  constructor() {
    this.queueId = queueId++;
    console.log(`[Queue](${this.queueId}) created queue`);
  }

  push(value: T): void {
    // console.log(`[Queue](${this.queueId}) pushing value`, loggable(value));
    const resolve = this.pullQueue.shift();
    if (resolve) {
      console.log(`[Queue](${this.queueId}) pushing value: found someone already listening... resolving his promise with`, loggable(value));
      return void resolve(value);
    }
    console.log(`[Queue](${this.queueId}) pushing value: nobody was awaiting value, storing it for later consumption`, loggable(value));
    this.pushQueue.push(Promise.resolve(value));
  }

  close(): void {
    console.log(`[Queue](${this.queueId}) closing queue, the for await loops attached will end`);

    this.isClosed = true;

    // for (const resolve of this.pullQueue) {
    //   resolve({ done: true } as any);
    // }

    this.onClose();
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      let next = this.pushQueue.shift();

      if (!next) {
        next = new Promise<T>((resolve) => this.pullQueue.push(resolve));
        console.log(`[Queue](${this.queueId}) next: no value found in queue, awaiting value`);
      } else {
        console.log(`[Queue](${this.queueId}) next: a value was already ready ! resolving now`);
      }

      if (this.isClosed) {
        return;
      }
      yield next;
    }
  }
}
