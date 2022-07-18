import { Queue, closeable } from "./elies-stream/queue";

async function* pair() {
  let i = 0;
  while (true) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    yield i;
    i = i + 2;
  }
}

async function* impair() {
  let i = 1;
  while (true) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    yield i;
    i = i + 2;
  }
}

const queue = new Queue<number>();
async function go(a: AsyncIterableIterator<number>) {
  for await (const number of a) {
    queue.push(number);
    console.log("oui");
  }
}

async function ga(
  a: AsyncIterableIterator<number> & {
    close: () => Promise<void>;
  }
) {
  for await (const i of a) {
    console.log(i);
    if (i > 10) {
      a.close();
      closing1.close();
      closing2.close();
    }
  }
}

const closing1 = closeable(pair());
const closing2 = closeable(impair());
const closingmerged = closeable(queue[Symbol.asyncIterator]());

go(closing1);
go(closing2);

// async function* merge(a: AsyncGenerator, b: AsyncGenerator) {
//   while (true) {
//     a.next();
//     b.next();
//   }
// }

ga(closingmerged);
