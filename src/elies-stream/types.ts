export type FiniteIterable<Result extends any> = AsyncIterableIterator<Result>;
export type InfiniteIterable<Result> = AsyncIterableIterator<Result> & { return: () => void }; // TODO check if throws are supported => throw should interrupt ( return )
export type SerializedEvent = { id: string; type: string; data: any };
export type Indexed<T> = T & { revision: bigint };
