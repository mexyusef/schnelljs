export declare class ToolExecutionError extends Error {
    readonly toolName: string;
    readonly input: unknown;
    readonly cause: unknown;
    constructor({ toolName, input, cause, message, }: {
        toolName: string;
        input: unknown;
        cause: unknown | undefined;
        message?: string;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolName: string;
        input: unknown;
    };
}
