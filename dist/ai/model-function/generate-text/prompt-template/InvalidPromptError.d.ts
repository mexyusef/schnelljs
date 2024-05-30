/**
 * Error thrown when a prompt validation fails.
 */
export declare class InvalidPromptError extends Error {
    readonly prompt: unknown;
    constructor(message: string, prompt: unknown);
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        prompt: unknown;
    };
}
