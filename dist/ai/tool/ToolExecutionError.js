import { getErrorMessage } from "../util/getErrorMessage.js";
export class ToolExecutionError extends Error {
    constructor({ toolName, input, cause, message = getErrorMessage(cause), }) {
        super(`Error executing tool '${toolName}': ${message}`);
        Object.defineProperty(this, "toolName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "input", {
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
        this.name = "ToolExecutionError";
        this.toolName = toolName;
        this.input = input;
        this.cause = cause;
    }
    toJSON() {
        return {
            name: this.name,
            cause: this.cause,
            message: this.message,
            stack: this.stack,
            toolName: this.toolName,
            input: this.input,
        };
    }
}
