import { getErrorMessage } from "../../util/getErrorMessage.js";
export class JSONParseError extends Error {
    constructor({ text, cause }) {
        super(`JSON parsing failed: ` +
            `Text: ${text}.\n` +
            `Error message: ${getErrorMessage(cause)}`);
        // note: property order determines debugging output
        Object.defineProperty(this, "text", {
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
        this.name = "JSONParseError";
        this.cause = cause;
        this.text = text;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            valueText: this.text,
        };
    }
}
