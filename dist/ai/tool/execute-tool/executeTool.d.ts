import { FunctionOptions } from "../../core/FunctionOptions.js";
import { Tool } from "../Tool.js";
export type ExecuteToolMetadata = {
    callId: string;
    runId?: string;
    sessionId?: string;
    userId?: string;
    functionId?: string;
    startTimestamp: Date;
    finishTimestamp: Date;
    durationInMs: number;
};
/**
 * `executeTool` executes a tool with the given parameters.
 */
export declare function executeTool<TOOL extends Tool<any, any, any>>(// eslint-disable-line @typescript-eslint/no-explicit-any
params: {
    tool: TOOL;
    args: TOOL["parameters"]["_type"];
    fullResponse?: false;
} & FunctionOptions): Promise<ReturnType<TOOL["execute"]>>;
export declare function executeTool<TOOL extends Tool<any, any, any>>(// eslint-disable-line @typescript-eslint/no-explicit-any
params: {
    tool: TOOL;
    args: TOOL["parameters"]["_type"];
    fullResponse: true;
} & FunctionOptions): Promise<{
    output: Awaited<ReturnType<TOOL["execute"]>>;
    metadata: ExecuteToolMetadata;
}>;
