import { Schema } from "../../core/schema/Schema.js";
export declare const createEventSourceResponseHandler: <T>(schema: Schema<T>) => ({ response }: {
    response: Response;
}) => Promise<AsyncIterable<import("../../index.js").Delta<T>>>;
