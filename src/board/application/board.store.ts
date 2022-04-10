import { Board } from "../domain/board";

export abstract class BoardStore {
  abstract load(roomName: string): Promise<Board | undefined>;
  abstract save(board: Board): Promise<void>;
}

// function* count() {
//   let i = 0;
//   while (i < 3) {
//     yield i++;
//   }
// }

// const counter = count();

// const a = counter.next(); // => { value: 0, done: false }
// const b = counter.next(); // => { value: 1, done: false }
// const c = counter.next(); // => { value: 2, done: false }
// const d = counter.next(); // => { value: undefined, done: true }

// for (const i of count()) {
//   console.log(i); // 0, 1, 2
// }

// async function* countSlowerAndSlower() {
//   let i = 0;
//   while (i < 3) {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     yield i++;
//   }
// }

// const slowCounter = countSlowerAndSlower();

// const e = slowCounter.next(); // => { value: [Promise => 0, 1000ms], done: false }
// const f = slowCounter.next(); // => { value: [Promise => 1, 2000ms], done: false }
// const g = slowCounter.next(); // => { value: [Promise => 2, 3000ms], done: false }
// const h = slowCounter.next(); // => { value: undefined, done: true }

// for await (const i of countSlowerAndSlower()) {
//   console.log(i); // [0, 1000ms], [1, 2000ms], [2, 3000ms]
// }

// export class Queue<T> {
//   private pullQueue: Array<(value: T) => void> = [];
//   private pushQueue: Array<Promise<T>> = [];
//   private isClosed = false;

//   push(value: T): void {
//     const resolve = this.pullQueue.shift();
//     if (resolve) return void resolve(value);

//     this.pushQueue.push(Promise.resolve(value));
//   }

//   close(): void {
//     this.isClosed = true;
//     this.push(undefined as any);
//   }

//   async *stream(): AsyncIterableIterator<T> {
//     while (true) {
//       const next = this.pushQueue.shift() || new Promise<T>((resolve) => this.pullQueue.push(resolve));
//       if (this.isClosed) {
//         return;
//       }
//       yield next;
//     }
//   }

//   // async *[Symbol.asyncIterator]() {
//   //   while (true) {
//   //     const next = this.pushQueue.shift() || new Promise<T>((resolve) => this.pullQueue.push(resolve));
//   //     if (this.isClosed) {
//   //       return;
//   //     }
//   //     yield next;
//   //   }
//   // }
// }

// // pushQueue -> stores the values that are not yet consumed
// // pullQueue -> stores the consumers that are waiting for a value

// // push -> check if there is a consumer waiting for a value, if so, resolve the consumer with the value, if not, push the value to the pushQueue
// // stream -> iterate over the pushQueue to get the values, if the pushQueue is empty, create a new Promise that resolves when a value is pushed to the Queue

// stores the consumers that are waiting for a valuestores the consumers that are waiting for a value
// const q = new Queue<number>();

// q.push(1);
// q.push(2);

// for await (const value of q.stream()) {
//   console.log(value); // 1, 2, [3]
// }

// q.push(3)
