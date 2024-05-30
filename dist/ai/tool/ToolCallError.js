import { getErrorMessage } from "../util/getErrorMessage.js";
export class ToolCallError extends Error {
    constructor({ cause, toolCall, message = getErrorMessage(cause), }) {
        super(`Tool call for tool '${toolCall.name}' failed: ${message}`);
        Object.defineProperty(this, "toolCall", {
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
        this.name = "ToolCallError";
        this.toolCall = toolCall;
        this.cause = cause;
    }
    toJSON() {
        return {
            name: this.name,
            cause: this.cause,
            message: this.message,
            stack: this.stack,
            toolCall: this.toolCall,
        };
    }
}
