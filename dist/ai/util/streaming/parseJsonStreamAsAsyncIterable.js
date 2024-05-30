import { AsyncQueue } from "../AsyncQueue.js";
import { parseJsonStream } from "./parseJsonStream.js";
export async function parseJsonStreamAsAsyncIterable({ stream, schema, }) {
    const queue = new AsyncQueue();
    // process the stream asynchonously (no 'await' on purpose):
    parseJsonStream({
        stream,
        schema,
        process(event) {
            queue.push({ type: "delta", deltaValue: event });
        },
        onDone() {
            queue.close();
        },
    });
    return queue;
}
