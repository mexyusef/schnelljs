export declare class TypeValidationError extends Error {
    readonly structure: unknown;
    readonly cause: unknown;
    constructor({ structure, cause }: {
        structure: unknown;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        object: unknown;
    };
}
