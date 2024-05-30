export class RetryError extends Error {
    constructor({ message, reason, errors, }) {
        super(message);
        // note: property order determines debugging output
        Object.defineProperty(this, "reason", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "RetryError";
        this.reason = reason;
        this.errors = errors;
        // separate our last error to make debugging via log easier:
        this.lastError = errors[errors.length - 1];
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            reason: this.reason,
            lastError: this.lastError,
            errors: this.errors,
        };
    }
}
