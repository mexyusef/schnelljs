import { executeStandardCall } from "../../model-function/executeStandardCall.js";
import { ToolCallArgumentsValidationError } from "../ToolCallArgumentsValidationError.js";
import { ToolCallGenerationError } from "../ToolCallGenerationError.js";
export async function generateToolCall({ model, tool, prompt, fullResponse, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(tool)
        : prompt;
    const callResponse = await executeStandardCall({
        functionType: "generate-tool-call",
        input: expandedPrompt,
        model,
        options,
        generateResponse: async (options) => {
            try {
                const result = await model.doGenerateToolCall(tool, expandedPrompt, options);
                const toolCall = result.toolCall;
                if (toolCall === null) {
                    throw new ToolCallGenerationError({
                        toolName: tool.name,
                        cause: "No tool call generated.",
                    });
                }
                const parseResult = tool.parameters.validate(toolCall.args);
                if (!parseResult.success) {
                    throw new ToolCallArgumentsValidationError({
                        toolName: tool.name,
                        args: toolCall.args,
                        cause: parseResult.error,
                    });
                }
                return {
                    rawResponse: result.rawResponse,
                    extractedValue: {
                        id: toolCall.id,
                        name: tool.name,
                        args: parseResult.data,
                    },
                    usage: result.usage,
                };
            }
            catch (error) {
                if (error instanceof ToolCallArgumentsValidationError ||
                    error instanceof ToolCallGenerationError) {
                    throw error;
                }
                throw new ToolCallGenerationError({
                    toolName: tool.name,
                    cause: error,
                });
            }
        },
    });
    return fullResponse
        ? {
            toolCall: callResponse.value,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
