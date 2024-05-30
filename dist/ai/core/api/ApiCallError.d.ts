export declare class ApiCallError extends Error {
    readonly url: string;
    readonly requestBodyValues: unknown;
    readonly statusCode?: number;
    readonly responseBody?: string;
    readonly cause?: unknown;
    readonly isRetryable: boolean;
    readonly data?: unknown;
    constructor({ message, url, requestBodyValues, statusCode, responseBody, cause, isRetryable, data, }: {
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode?: number;
        responseBody?: string;
        cause?: unknown;
        isRetryable?: boolean;
        data?: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode: number | undefined;
        responseBody: string | undefined;
        cause: unknown;
        isRetryable: boolean;
        data: unknown;
    };
}
