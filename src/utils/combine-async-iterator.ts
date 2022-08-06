export const combineAsyncIterables = async function* <T>(
    asyncIterables: AsyncIterable<T>[],
  ): AsyncGenerator<T> {
    const asyncIterators = Array.from(asyncIterables, (o) =>
      o[Symbol.asyncIterator](),
    );
    const results = [];
    let count = asyncIterators.length;
    const never: Promise<never> = new Promise(() => {});
    const getNext = (asyncIterator: AsyncIterator<T>, index: number) =>
      asyncIterator.next().then((result) => ({ index, result }));
  
    const nextPromises = asyncIterators.map(getNext);
    try {
      while (count) {
        const { index, result } = await Promise.race(nextPromises);
        if (result.done) {
          nextPromises[index] = never;
          results[index] = result.value;
          count--;
        } else {
          nextPromises[index] = getNext(asyncIterators[index], index);
          yield result.value;
        }
      }
    } finally {
      for (const [index, iterator] of asyncIterators.entries()) {
        if (nextPromises[index] != never && iterator.return != null) {
          void iterator.return();
        }
      }
    }
    return results;
  }; 