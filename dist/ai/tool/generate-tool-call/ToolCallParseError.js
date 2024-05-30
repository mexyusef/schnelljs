import { getErrorMessage } from "../../util/getErrorMessage.js";
export class ToolCallParseError extends Error {
    constructor({ toolName, valueText, cause, }) {
        super(`Tool call parsing failed for '${toolName}'. ` +
            `Value: ${valueText}.\n` +
            `Error message: ${getErrorMessage(cause)}`);
        Object.defineProperty(this, "toolName", {
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
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "ToolCallParseError";
        this.toolName = toolName;
        this.cause = cause;
        this.valueText = valueText;
    }
    toJSON() {
        return {
            name: this.name,
            cause: this.cause,
            message: this.message,
            stack: this.stack,
            toolName: this.toolName,
            valueText: this.valueText,
        };
    }
}
