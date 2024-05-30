import { parseJsonStreamAsAsyncIterable } from "./parseJsonStreamAsAsyncIterable.js";
export const createJsonStreamResponseHandler = (schema) => ({ response }) => parseJsonStreamAsAsyncIterable({
    stream: response.body,
    schema,
});
