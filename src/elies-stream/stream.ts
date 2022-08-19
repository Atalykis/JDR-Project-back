// import { Queue } from "./queue";
// import { FiniteIterable, Indexed, InfiniteIterable } from "./types";

// // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// // read(4) -> [4, 5, 6, 7, 8, 9]
// // subscribe() -> [10?, 11?, 12?]

// // follow(4) -> [...read(4), 10?, 11?, 12?]

// // Stream
// // -> Subscription = Queue
// // Stream.append => * subs -> event

// export class Stream<E extends any> {
//   subscriptions = new Set<Queue<Indexed<E>>>();
//   constructor(public events: Indexed<E>[] = []) {}

//   append(element: E) {
//     const revision = BigInt(this.events.length);
//     const clone = Object.assign({}, element, { revision });
//     this.events.push(clone);
//     for (const s of this.subscriptions) s.push(clone);
//   }

//   async *read(from = 0n): FiniteIterable<Indexed<E>> {
//     const revision = Number(from);
//     for (let i = revision; i < this.events.length; i++) {
//       yield this.events[i];
//     }
//   }

//   async subscribe(): Promise<InfiniteIterable<Indexed<E>>> {
//     const subscription = new Queue<Indexed<E>>();
//     this.subscriptions.add(subscription);

//     const iterator = subscription[Symbol.asyncIterator]();

//     return attachEndHook(iterator, () => {
//       this.subscriptions.delete(subscription);
//       subscription.close();
//     });
//   }

//   async follow(from = 0n): Promise<InfiniteIterable<Indexed<E>>> {
//     const subscription = new Queue<Indexed<E>>();
//     this.subscriptions.add(subscription);

//     for await (const event of this.read(from)) subscription.push(event);

//     const iterator = subscription[Symbol.asyncIterator]();

//     return attachEndHook(iterator, () => {
//       this.subscriptions.delete(subscription);
//     });
//   }
// }

// export async function attachEndHook<E>(iterator: FiniteIterable<E>, onReturn: () => void): Promise<InfiniteIterable<E>> {
//   return {
//     async [Symbol.asyncIterator]() {
//       return this;
//     },
//     next: () => iterator.next(),
//     throw: () => iterator.throw!(),
//     return: (value?: any) => {
//       onReturn();
//       return iterator.return?.(value) as any;
//     },
//   };
// }
