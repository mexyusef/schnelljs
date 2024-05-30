export declare class StructureValidationError extends Error {
    readonly cause: unknown;
    readonly valueText: string;
    readonly value: unknown;
    constructor({ value, valueText, cause, }: {
        value: unknown;
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        value: unknown;
        valueText: string;
    };
}
