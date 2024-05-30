export class AbstractApiConfiguration {
    constructor({ retry, throttle, customCallHeaders = () => ({}), }) {
        Object.defineProperty(this, "retry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "throttle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customCallHeaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.retry = retry;
        this.throttle = throttle;
        this.customCallHeaders = customCallHeaders;
    }
    headers(params) {
        return Object.fromEntries([
            ...Object.entries(this.fixedHeaders(params)),
            ...Object.entries(this.customCallHeaders(params)),
        ].filter(
        // remove undefined values:
        (entry) => typeof entry[1] === "string"));
    }
}
