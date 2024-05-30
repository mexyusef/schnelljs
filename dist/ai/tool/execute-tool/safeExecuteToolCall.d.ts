import { FunctionOptions } from "../../core/FunctionOptions.js";
import { Tool } from "../Tool.js";
import { ToolCall } from "../ToolCall.js";
import { ToolCallResult } from "../ToolCallResult.js";
export declare function safeExecuteToolCall<TOOL extends Tool<string, unknown, any>>(tool: TOOL, toolCall: ToolCall<TOOL["name"], TOOL["parameters"]>, options?: FunctionOptions): Promise<ToolCallResult<TOOL["name"], TOOL["parameters"], Awaited<ReturnType<TOOL["execute"]>>>>;
