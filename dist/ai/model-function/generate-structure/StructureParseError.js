import { getErrorMessage } from "../../util/getErrorMessage.js";
export class StructureParseError extends Error {
    constructor({ valueText, cause }) {
        super(`Structure parsing failed. ` +
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
        this.name = "StructureParseError";
        this.cause = cause;
        this.valueText = valueText;
    }
    toJSON() {
        return {
            name: this.name,
            cause: this.cause,
            message: this.message,
            stack: this.stack,
            valueText: this.valueText,
        };
    }
}
