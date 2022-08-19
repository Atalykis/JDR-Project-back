// import { Stream } from "./stream";

// let i = 0;

// class Event {
//   name: number;
//   constructor() {
//     this.name = i++;
//   }
// }

// describe("Stream", () => {
//   async function take(iterator: AsyncIterable<any>, amount: number) {
//     const result = [];

//     for await (const event of iterator) {
//       result.push(event);
//       if (result.length === amount) return result;
//     }

//     return result;
//   }

//   it("should allow to iterate over content", async () => {
//     const first = new Event();
//     const second = new Event();

//     const stream = new Stream();

//     stream.append(first);
//     stream.append(second);

//     const iterator = stream.read();

//     expect(await iterator.next()).toEqual({ done: false, value: { ...first, revision: 0n } });
//     expect(await iterator.next()).toEqual({ done: false, value: { ...second, revision: 1n } });
//   });

//   it("should allow to stream content", async () => {
//     const first = new Event();
//     const second = new Event();

//     const stream = new Stream();

//     const iterator = await stream.follow();

//     stream.append(first);

//     expect(await iterator.next()).toEqual({ done: false, value: { ...first, revision: 0n } });

//     const secondPromise = iterator.next();

//     stream.append(second);

//     expect(await secondPromise).toEqual({ done: false, value: { ...second, revision: 1n } });
//   });

//   it("should clean up the consumptions", async () => {
//     const stream = new Stream();

//     const iterator = await stream.follow();

//     expect(stream.subscriptions.size).toBe(1);

//     iterator.return();

//     expect(stream.subscriptions.size).toBe(0);
//   });

//   it("should retrieve correct revisions", async () => {
//     const first = new Event();
//     const second = new Event();

//     const stream = new Stream();

//     stream.append(first);
//     stream.append(second);

//     expect(await take(await stream.follow(), 2)).toEqual([
//       { ...first, revision: 0n },
//       { ...second, revision: 1n },
//     ]);
//   });

//   it("should start reading from a given revision", async () => {
//     const first = new Event();
//     const second = new Event();
//     const third = new Event();
//     const fourth = new Event();

//     const stream = new Stream();

//     stream.append(first);
//     stream.append(second);
//     stream.append(third);
//     stream.append(fourth);

//     const iterator = await stream.follow(2n);

//     const firstResult = await iterator.next();
//     expect(firstResult).toEqual({ done: false, value: { ...third, revision: 2n } });

//     const secondResult = await iterator.next();
//     expect(secondResult).toEqual({ done: false, value: { ...fourth, revision: 3n } });
//   });
// });
