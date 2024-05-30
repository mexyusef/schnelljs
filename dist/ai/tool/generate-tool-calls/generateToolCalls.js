import { executeStandardCall } from "../../model-function/executeStandardCall.js";
import { NoSuchToolDefinitionError } from "../NoSuchToolDefinitionError.js";
import { ToolCallArgumentsValidationError } from "../ToolCallArgumentsValidationError.js";
export async function generateToolCalls({ model, tools, prompt, fullResponse, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(tools)
        : prompt;
    const callResponse = await executeStandardCall({
        functionType: "generate-tool-calls",
        input: expandedPrompt,
        model,
        options,
        generateResponse: async (options) => {
            const result = await model.doGenerateToolCalls(tools, expandedPrompt, options);
            const { text, toolCalls: rawToolCalls } = result;
            // no tool calls:
            if (rawToolCalls == null) {
                return {
                    rawResponse: result.rawResponse,
                    extractedValue: { text, toolCalls: null },
                    usage: result.usage,
                };
            }
            // map tool calls:
            const toolCalls = rawToolCalls.map((rawToolCall) => {
                const tool = tools.find((tool) => tool.name === rawToolCall.name);
                if (tool == undefined) {
                    throw new NoSuchToolDefinitionError({
                        toolName: rawToolCall.name,
                        parameters: rawToolCall.args,
                    });
                }
                const parseResult = tool.parameters.validate(rawToolCall.args);
                if (!parseResult.success) {
                    throw new ToolCallArgumentsValidationError({
                        toolName: tool.name,
                        args: rawToolCall.args,
                        cause: parseResult.error,
                    });
                }
                return {
                    id: rawToolCall.id,
                    name: tool.name,
                    args: parseResult.data,
                };
            });
            return {
                rawResponse: result.rawResponse,
                extractedValue: {
                    text,
                    toolCalls: toolCalls,
                },
                usage: result.usage,
            };
        },
    });
    return fullResponse ? callResponse : callResponse.value;
}
