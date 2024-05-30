import { getErrorMessage } from "../util/getErrorMessage.js";
/**
 * Thrown when the arguments of a tool call are invalid.
 *
 * This typically means they don't match the parameters schema that is expected the tool.
 */
export class ToolCallArgumentsValidationError extends Error {
    constructor({ toolName, args, cause, }) {
        super(`Argument validation failed for tool '${toolName}'.\n` +
            `Arguments: ${JSON.stringify(args)}.\n` +
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
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "ToolCallArgumentsValidationError";
        this.toolName = toolName;
        this.cause = cause;
        this.args = args;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            toolName: this.toolName,
            args: this.args,
        };
    }
}
