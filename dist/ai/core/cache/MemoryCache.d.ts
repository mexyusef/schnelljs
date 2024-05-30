import { Cache } from "./Cache.js";
export declare class MemoryCache implements Cache {
    private readonly cache;
    private hashKey;
    lookupValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }): Promise<object | null>;
    storeValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }, value: unknown): Promise<void>;
}
