import { ToolCallError } from "../ToolCallError.js";
import { ToolExecutionError } from "../ToolExecutionError.js";
import { executeTool } from "./executeTool.js";
export async function safeExecuteToolCall(tool, toolCall, options) {
    try {
        return {
            tool: toolCall.name,
            toolCall,
            args: toolCall.args,
            ok: true,
            result: await executeTool({ tool, args: toolCall.args, ...options }),
        };
    }
    catch (error) {
        // If the error is an AbortError, rethrow it.
        if (error instanceof Error && error.name === "AbortError") {
            throw error;
        }
        return {
            tool: toolCall.name,
            toolCall,
            args: toolCall.args,
            ok: false,
            result: new ToolCallError({
                toolCall,
                cause: error instanceof ToolExecutionError ? error.cause : error,
            }),
        };
    }
}
