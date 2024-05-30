export declare class ToolCallParseError extends Error {
    readonly toolName: string;
    readonly valueText: string;
    readonly cause: unknown;
    constructor({ toolName, valueText, cause, }: {
        toolName: string;
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolName: string;
        valueText: string;
    };
}
