import { Schema } from "../../core/schema/Schema.js";
import { Delta } from "../../model-function/Delta.js";
export declare function parseEventSourceStreamAsAsyncIterable<T>({ stream, schema, }: {
    stream: ReadableStream<Uint8Array>;
    schema: Schema<T>;
}): Promise<AsyncIterable<Delta<T>>>;
