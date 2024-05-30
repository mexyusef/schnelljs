/// <reference types="node" />
import { Schema } from "../schema/Schema.js";
import { ApiCallError } from "./ApiCallError.js";
export type ResponseHandler<T> = (options: {
    url: string;
    requestBodyValues: unknown;
    response: Response;
}) => PromiseLike<T>;
export declare const createJsonErrorResponseHandler: <T>({ errorSchema, errorToMessage, isRetryable, }: {
    errorSchema: Schema<T>;
    errorToMessage: (error: T) => string;
    isRetryable?: ((response: Response, error?: T | undefined) => boolean) | undefined;
}) => ResponseHandler<ApiCallError>;
export declare const createTextErrorResponseHandler: ({ isRetryable, }?: {
    isRetryable?: ((response: Response) => boolean) | undefined;
}) => ResponseHandler<ApiCallError>;
export declare const createJsonResponseHandler: <T>(responseSchema: Schema<T>) => ResponseHandler<T>;
export declare const createTextResponseHandler: () => ResponseHandler<string>;
export declare const createAudioMpegResponseHandler: () => ResponseHandler<Buffer>;
export declare const postJsonToApi: <T>({ url, headers, body, failedResponseHandler, successfulResponseHandler, abortSignal, }: {
    url: string;
    headers?: Record<string, string> | undefined;
    body: unknown;
    failedResponseHandler: ResponseHandler<ApiCallError>;
    successfulResponseHandler: ResponseHandler<T>;
    abortSignal?: AbortSignal | undefined;
}) => Promise<T>;
export declare const postToApi: <T>({ url, headers, body, successfulResponseHandler, failedResponseHandler, abortSignal, }: {
    url: string;
    headers?: Record<string, string> | undefined;
    body: {
        content: string | FormData | Buffer;
        values: unknown;
    };
    failedResponseHandler: ResponseHandler<Error>;
    successfulResponseHandler: ResponseHandler<T>;
    abortSignal?: AbortSignal | undefined;
}) => Promise<T>;
