import { FunctionOptions } from "../../core/FunctionOptions.js";
import { Tool } from "../Tool.js";
import { ToolCallResult } from "../ToolCallResult.js";
import { ToolCallsGenerationModel, ToolCallsGenerationModelSettings } from "../generate-tool-calls/ToolCallsGenerationModel.js";
type ToolArray<T extends Tool<any, any, any>[]> = T;
type ToToolMap<T extends ToolArray<Tool<any, any, any>[]>> = {
    [K in T[number]["name"]]: Extract<T[number], Tool<K, any, any>>;
};
type StringKeys<T> = Extract<keyof T, string>;
type ToToolCallUnion<T> = {
    [KEY in StringKeys<T>]: T[KEY] extends Tool<any, infer PARAMETERS, infer OUTPUT> ? ToolCallResult<KEY, PARAMETERS, OUTPUT> : never;
}[StringKeys<T>];
type ToOutputValue<TOOLS extends ToolArray<Tool<any, any, any>[]>> = ToToolCallUnion<ToToolMap<TOOLS>>;
export declare function useTools<PROMPT, TOOLS extends Array<Tool<any, any, any>>>({ model, tools, prompt, ...options }: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
} & FunctionOptions): Promise<{
    text: string | null;
    toolResults: Array<ToOutputValue<TOOLS>> | null;
}>;
export {};
