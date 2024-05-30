import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../../model-function/ModelCallMetadata.js";
import { ToolDefinition } from "../ToolDefinition.js";
import { ToolCallsGenerationModel, ToolCallsGenerationModelSettings } from "./ToolCallsGenerationModel.js";
type ToolCallDefinitionArray<T extends ToolDefinition<any, any>[]> = T;
type ToToolCallDefinitionMap<T extends ToolCallDefinitionArray<ToolDefinition<any, any>[]>> = {
    [K in T[number]["name"]]: Extract<T[number], ToolDefinition<K, any>>;
};
type ToToolCallUnion<T> = {
    [KEY in keyof T]: T[KEY] extends ToolDefinition<any, infer PARAMETERS> ? {
        id: string;
        name: KEY;
        args: PARAMETERS;
    } : never;
}[keyof T];
type ToOutputValue<TOOL_CALLS extends ToolCallDefinitionArray<ToolDefinition<any, any>[]>> = ToToolCallUnion<ToToolCallDefinitionMap<TOOL_CALLS>>;
export declare function generateToolCalls<TOOLS extends Array<ToolDefinition<any, any>>, PROMPT>(params: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
    fullResponse?: false;
} & FunctionOptions): Promise<{
    text: string | null;
    toolCalls: Array<ToOutputValue<TOOLS>> | null;
}>;
export declare function generateToolCalls<TOOLS extends ToolDefinition<any, any>[], PROMPT>(params: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
    fullResponse: true;
} & FunctionOptions): Promise<{
    value: {
        text: string | null;
        toolCalls: Array<ToOutputValue<TOOLS>>;
    };
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
export {};
