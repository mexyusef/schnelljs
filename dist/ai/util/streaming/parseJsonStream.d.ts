import { Schema } from "../../core/schema/Schema.js";
export declare function parseJsonStream<T>({ schema, stream, process, onDone, }: {
    schema: Schema<T>;
    stream: ReadableStream<Uint8Array>;
    process: (event: T) => void;
    onDone?: () => void;
}): Promise<void>;
