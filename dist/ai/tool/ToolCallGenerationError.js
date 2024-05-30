import { getErrorMessage } from "../util/getErrorMessage.js";
export class ToolCallGenerationError extends Error {
    constructor({ toolName, cause }) {
        super(`Tool call generation failed for tool '${toolName}'. ` +
            `Error message: ${getErrorMessage(cause)}`);
        Object.defineProperty(this, "toolName", {
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
        this.name = "ToolCallsGenerationError";
        this.toolName = toolName;
        this.cause = cause;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            toolName: this.toolName,
        };
    }
}
