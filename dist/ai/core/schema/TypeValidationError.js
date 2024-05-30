import { getErrorMessage } from "../../util/getErrorMessage.js";
export class TypeValidationError extends Error {
    constructor({ structure, cause }) {
        super(`Type validation failed: ` +
            `Structure: ${JSON.stringify(structure)}.\n` +
            `Error message: ${getErrorMessage(cause)}`);
        Object.defineProperty(this, "structure", {
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
        this.name = "TypeValidationError";
        this.cause = cause;
        this.structure = structure;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            object: this.structure,
        };
    }
}
