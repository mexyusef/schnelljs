import { executeFunctionCall } from "../../core/executeFunctionCall.js";
import { safeExecuteToolCall } from "../execute-tool/safeExecuteToolCall.js";
import { generateToolCall } from "../generate-tool-call/generateToolCall.js";
/**
 * `useTool` uses `generateToolCall` to generate parameters for a tool and
 * then executes the tool with the parameters using `executeTool`.
 *
 * @returns The result contains the name of the tool (`tool` property),
 * the parameters (`parameters` property, typed),
 * and the result of the tool execution (`result` property, typed).
 *
 * @see {@link generateToolCall}
 * @see {@link executeTool}
 */
export async function useTool({ model, tool, prompt, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(tool)
        : prompt;
    return executeFunctionCall({
        options,
        input: expandedPrompt,
        functionType: "use-tool",
        execute: async (options) => safeExecuteToolCall(tool, await generateToolCall({ model, tool, prompt: expandedPrompt, ...options }), options),
    });
}
