export declare class JSONParseError extends Error {
    readonly text: string;
    readonly cause: unknown;
    constructor({ text, cause }: {
        text: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        valueText: string;
    };
}
