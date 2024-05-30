import { Schema } from "../../core/schema/Schema.js";
export declare const createJsonStreamResponseHandler: <T>(schema: Schema<T>) => ({ response }: {
    response: Response;
}) => Promise<AsyncIterable<import("../../index.js").Delta<T>>>;
