export declare class StructureParseError extends Error {
    readonly cause: unknown;
    readonly valueText: string;
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
