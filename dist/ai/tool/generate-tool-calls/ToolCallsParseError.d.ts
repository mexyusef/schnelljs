export declare class ToolCallsParseError extends Error {
    readonly valueText: string;
    readonly cause: unknown;
    constructor({ valueText, cause }: {
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        valueText: string;
    };
}
