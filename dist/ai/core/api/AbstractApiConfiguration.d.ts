import { RetryFunction } from "./RetryFunction.js";
import { ThrottleFunction } from "./ThrottleFunction.js";
import { ApiConfiguration, HeaderParameters } from "./ApiConfiguration.js";
import { CustomHeaderProvider } from "./CustomHeaderProvider.js";
export declare abstract class AbstractApiConfiguration implements ApiConfiguration {
    readonly retry?: RetryFunction;
    readonly throttle?: ThrottleFunction;
    protected readonly customCallHeaders: CustomHeaderProvider;
    constructor({ retry, throttle, customCallHeaders, }: {
        retry?: RetryFunction;
        throttle?: ThrottleFunction;
        customCallHeaders?: CustomHeaderProvider;
    });
    abstract assembleUrl(path: string): string;
    protected abstract fixedHeaders(params: HeaderParameters): Record<string, string>;
    headers(params: HeaderParameters): Record<string, string>;
}
