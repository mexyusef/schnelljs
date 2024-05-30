import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../../model-function/ModelCallMetadata.js";
import { ToolCall } from "../ToolCall.js";
import { ToolDefinition } from "../ToolDefinition.js";
import { ToolCallGenerationModel, ToolCallGenerationModelSettings } from "./ToolCallGenerationModel.js";
export declare function generateToolCall<PARAMETERS, PROMPT, NAME extends string, SETTINGS extends ToolCallGenerationModelSettings>(params: {
    model: ToolCallGenerationModel<PROMPT, SETTINGS>;
    tool: ToolDefinition<NAME, PARAMETERS>;
    prompt: PROMPT | ((tool: ToolDefinition<NAME, PARAMETERS>) => PROMPT);
    fullResponse?: false;
} & FunctionOptions): Promise<ToolCall<NAME, PARAMETERS>>;
export declare function generateToolCall<PARAMETERS, PROMPT, NAME extends string, SETTINGS extends ToolCallGenerationModelSettings>(params: {
    model: ToolCallGenerationModel<PROMPT, SETTINGS>;
    tool: ToolDefinition<NAME, PARAMETERS>;
    prompt: PROMPT | ((tool: ToolDefinition<NAME, PARAMETERS>) => PROMPT);
    fullResponse: true;
} & FunctionOptions): Promise<{
    toolCall: ToolCall<NAME, PARAMETERS>;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
