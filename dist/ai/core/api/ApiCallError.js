export class ApiCallError extends Error {
    constructor({ message, url, requestBodyValues, statusCode, responseBody, cause, isRetryable = statusCode != null &&
        (statusCode === 429 || statusCode >= 500), data, }) {
        super(message);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestBodyValues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "responseBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRetryable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "ApiCallError";
        this.url = url;
        this.requestBodyValues = requestBodyValues;
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        this.cause = cause;
        this.isRetryable = isRetryable;
        this.data = data;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            url: this.url,
            requestBodyValues: this.requestBodyValues,
            statusCode: this.statusCode,
            responseBody: this.responseBody,
            cause: this.cause,
            isRetryable: this.isRetryable,
            data: this.data,
        };
    }
}
