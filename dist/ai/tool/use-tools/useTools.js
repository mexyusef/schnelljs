import { executeFunctionCall } from "../../core/executeFunctionCall.js";
import { ToolCallError } from "../ToolCallError.js";
import { safeExecuteToolCall } from "../execute-tool/safeExecuteToolCall.js";
import { generateToolCalls } from "../generate-tool-calls/generateToolCalls.js";
export async function useTools({ model, tools, prompt, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(tools)
        : prompt;
    return executeFunctionCall({
        options,
        input: expandedPrompt,
        functionType: "use-tools",
        execute: async (options) => {
            const modelResponse = await generateToolCalls({
                model,
                tools,
                prompt: expandedPrompt,
                fullResponse: false,
                ...options,
            });
            const { toolCalls, text } = modelResponse;
            // no tool calls:
            if (toolCalls == null) {
                return { text, toolResults: null };
            }
            // execute tools in parallel:
            const toolResults = await Promise.all(toolCalls.map(async (toolCall) => {
                const tool = tools.find((tool) => tool.name === toolCall.name);
                if (tool == null) {
                    return {
                        tool: toolCall.name,
                        toolCall,
                        args: toolCall.args,
                        ok: false,
                        result: new ToolCallError({
                            message: `No tool with name '${toolCall.name}' found.`,
                            toolCall,
                        }),
                    };
                }
                return await safeExecuteToolCall(tool, toolCall, options);
            }));
            return {
                text,
                toolResults: toolResults,
            };
        },
    });
}
