/**
 * Thrown when the arguments of a tool call are invalid.
 *
 * This typically means they don't match the parameters schema that is expected the tool.
 */
export declare class ToolCallArgumentsValidationError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    readonly args: unknown;
    constructor({ toolName, args, cause, }: {
        toolName: string;
        args: unknown;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
        args: unknown;
    };
}
