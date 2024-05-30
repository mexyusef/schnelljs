export declare class NoSuchToolDefinitionError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    readonly parameters: unknown;
    constructor({ toolName, parameters, }: {
        toolName: string;
        parameters: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
        parameter: unknown;
    };
}
