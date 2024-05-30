import { ToolCall } from "./ToolCall.js";
export declare class ToolCallError extends Error {
    readonly toolCall: ToolCall<string, unknown>;
    readonly cause: unknown | undefined;
    constructor({ cause, toolCall, message, }: {
        toolCall: ToolCall<string, unknown>;
        cause?: unknown;
        message?: string;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolCall: ToolCall<string, unknown>;
    };
}
