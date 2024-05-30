import { parseEventSourceStreamAsAsyncIterable } from "./parseEventSourceStreamAsAsyncIterable.js";
export const createEventSourceResponseHandler = (schema) => ({ response }) => parseEventSourceStreamAsAsyncIterable({
    stream: response.body,
    schema,
});
