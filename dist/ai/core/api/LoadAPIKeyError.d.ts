export declare class LoadAPIKeyError extends Error {
    constructor({ message }: {
        message: string;
    });
    toJSON(): {
        name: string;
        message: string;
    };
}
