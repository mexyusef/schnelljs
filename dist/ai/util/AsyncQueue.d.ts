/**
 * `AsyncQueue` is a class that represents an asynchronous queue.
 * It allows values to be pushed onto it and consumed (pulled) by an iterator.
 * The queue is async-iterable, making it compatible with async/await syntax.
 *
 * @template T The type of elements contained in the queue.
 * @example
 * const queue = new AsyncQueue<number>();
 * queue.push(1);
 * (async () => {
 *   for await (const value of queue) {
 *     console.log(value);
 *   }
 * })();
 */
export declare class AsyncQueue<T> implements AsyncIterable<T> {
    private values;
    private pendingResolvers;
    private closed;
    private processPendingResolvers;
    /**
     * Pushes an element onto the queue. If the queue is closed, an error is thrown.
     *
     * @param {T} value - The element to add to the queue.
     * @throws {Error} Throws an error if the queue is closed.
     * @example
     * queue.push(2);
     */
    push(value: T): void;
    error(error: unknown): void;
    /**
     * Closes the queue, preventing more elements from being pushed onto it.
     *
     * @example
     * queue.close();
     */
    close(): void;
    /**
     * Creates and returns an async iterator that allows the queue to be consumed.
     * You can create multiple iterators for the same queue.
     *
     * @returns {AsyncIterator<T>} An async iterator for the queue.
     * @example
     * (async () => {
     *   for await (const value of queue) {
     *     console.log(value);
     *   }
     * })();
     */
    [Symbol.asyncIterator](): AsyncIterator<T>;
}
