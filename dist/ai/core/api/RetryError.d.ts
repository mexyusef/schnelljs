export type RetryErrorReason = "maxTriesExceeded" | "errorNotRetryable" | "abort";
export declare class RetryError extends Error {
    readonly reason: RetryErrorReason;
    readonly lastError: unknown;
    readonly errors: Array<unknown>;
    constructor({ message, reason, errors, }: {
        message: string;
        reason: RetryErrorReason;
        errors: Array<unknown>;
    });
    toJSON(): {
        name: string;
        message: string;
        reason: RetryErrorReason;
        lastError: unknown;
        errors: unknown[];
    };
}
