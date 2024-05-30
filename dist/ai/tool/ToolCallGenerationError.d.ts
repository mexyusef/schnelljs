export declare class ToolCallGenerationError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    constructor({ toolName, cause }: {
        toolName: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
    };
}
