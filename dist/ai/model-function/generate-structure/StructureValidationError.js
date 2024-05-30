import { getErrorMessage } from "../../util/getErrorMessage.js";
export class StructureValidationError extends Error {
    constructor({ value, valueText, cause, }) {
        super(`Structure validation failed. ` +
            `Value: ${valueText}.\n` +
            `Error message: ${getErrorMessage(cause)}`);
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "valueText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "StructureValidationError";
        this.cause = cause;
        this.value = value;
        this.valueText = valueText;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            value: this.value,
            valueText: this.valueText,
        };
    }
}
