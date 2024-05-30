export class MemoryCache {
    constructor() {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    hashKey(key) {
        return JSON.stringify(key);
    }
    async lookupValue(key) {
        return this.cache.get(this.hashKey(key)) ?? null;
    }
    async storeValue(key, value) {
        this.cache.set(this.hashKey(key), value);
    }
}
