import { FunctionOptions } from "../../core/FunctionOptions.js";
import { Tool } from "../Tool.js";
import { ToolCallResult } from "../ToolCallResult.js";
import { ToolCallGenerationModel, ToolCallGenerationModelSettings } from "../generate-tool-call/ToolCallGenerationModel.js";
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
export declare function useTool<PROMPT, TOOL extends Tool<string, any, any>>({ model, tool, prompt, ...options }: {
    model: ToolCallGenerationModel<PROMPT, ToolCallGenerationModelSettings>;
    tool: TOOL;
    prompt: PROMPT | ((tool: TOOL) => PROMPT);
} & FunctionOptions): Promise<ToolCallResult<TOOL["name"], TOOL["parameters"], Awaited<ReturnType<TOOL["execute"]>>>>;
