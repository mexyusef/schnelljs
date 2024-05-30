import { parseJSON, safeParseJSON } from "../schema/parseJSON.js";
import { ApiCallError } from "./ApiCallError.js";
export const createJsonErrorResponseHandler = ({ errorSchema, errorToMessage, isRetryable, }) => async ({ response, url, requestBodyValues }) => {
    const responseBody = await response.text();
    // Some providers return an empty response body for some errors:
    if (responseBody.trim() === "") {
        return new ApiCallError({
            message: response.statusText,
            url,
            requestBodyValues,
            statusCode: response.status,
            responseBody,
            isRetryable: isRetryable?.(response),
        });
    }
    // resilient parsing in case the response is not JSON or does not match the schema:
    try {
        const parsedError = parseJSON({
            text: responseBody,
            schema: errorSchema,
        });
        return new ApiCallError({
            message: errorToMessage(parsedError),
            url,
            requestBodyValues,
            statusCode: response.status,
            responseBody,
            data: parsedError,
            isRetryable: isRetryable?.(response, parsedError),
        });
    }
    catch (parseError) {
        return new ApiCallError({
            message: response.statusText,
            url,
            requestBodyValues,
            statusCode: response.status,
            responseBody,
            isRetryable: isRetryable?.(response),
        });
    }
};
export const createTextErrorResponseHandler = ({ isRetryable, } = {}) => async ({ response, url, requestBodyValues }) => {
    const responseBody = await response.text();
    return new ApiCallError({
        message: responseBody.trim() !== "" ? responseBody : response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseBody,
        isRetryable: isRetryable?.(response),
    });
};
export const createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
    const responseBody = await response.text();
    const parsedResult = safeParseJSON({
        text: responseBody,
        schema: responseSchema,
    });
    if (!parsedResult.success) {
        throw new ApiCallError({
            message: "Invalid JSON response",
            cause: parsedResult.error,
            statusCode: response.status,
            responseBody,
            url,
            requestBodyValues,
        });
    }
    return parsedResult.data;
};
export const createTextResponseHandler = () => async ({ response }) => response.text();
export const createAudioMpegResponseHandler = () => async ({ response, url, requestBodyValues }) => {
    if (response.headers.get("Content-Type") !== "audio/mpeg") {
        throw new ApiCallError({
            message: "Invalid Content-Type (must be audio/mpeg)",
            statusCode: response.status,
            url,
            requestBodyValues,
        });
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};
export const postJsonToApi = async ({ url, headers, body, failedResponseHandler, successfulResponseHandler, abortSignal, }) => postToApi({
    url,
    headers: {
        ...headers,
        "Content-Type": "application/json",
    },
    body: {
        content: JSON.stringify(body),
        values: body,
    },
    failedResponseHandler,
    successfulResponseHandler,
    abortSignal,
});
export const postToApi = async ({ url, headers = {}, body, successfulResponseHandler, failedResponseHandler, abortSignal, }) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: body.content,
            signal: abortSignal,
        });
        if (!response.ok) {
            try {
                throw await failedResponseHandler({
                    response,
                    url,
                    requestBodyValues: body.values,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError" || error instanceof ApiCallError) {
                        throw error;
                    }
                }
                throw new ApiCallError({
                    message: "Failed to process error response",
                    cause: error,
                    statusCode: response.status,
                    url,
                    requestBodyValues: body.values,
                });
            }
        }
        try {
            return await successfulResponseHandler({
                response,
                url,
                requestBodyValues: body.values,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError" || error instanceof ApiCallError) {
                    throw error;
                }
            }
            throw new ApiCallError({
                message: "Failed to process successful response",
                cause: error,
                statusCode: response.status,
                url,
                requestBodyValues: body.values,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw error;
            }
        }
        // unwrap original error when fetch failed (for easier debugging):
        if (error instanceof TypeError && error.message === "fetch failed") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cause = error.cause;
            if (cause != null) {
                // Failed to connect to server:
                throw new ApiCallError({
                    message: `Cannot connect to API: ${cause.message}`,
                    cause,
                    url,
                    requestBodyValues: body.values,
                    isRetryable: true,
                });
            }
        }
        throw error;
    }
};
