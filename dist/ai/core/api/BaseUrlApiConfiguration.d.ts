import { AbstractApiConfiguration } from "./AbstractApiConfiguration.js";
import { CustomHeaderProvider } from "./CustomHeaderProvider.js";
import { RetryFunction } from "./RetryFunction.js";
import { ThrottleFunction } from "./ThrottleFunction.js";
export type UrlParts = {
    protocol: string;
    host: string;
    port: string;
    path: string;
};
export type BaseUrlPartsApiConfigurationOptions = {
    baseUrl: string | UrlParts;
    headers?: Record<string, string>;
    customCallHeaders?: CustomHeaderProvider;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
};
/**
 * An API configuration that uses different URL parts and a set of headers.
 *
 * You can use it to configure custom APIs for models, e.g. your own internal OpenAI proxy with custom headers.
 */
export declare class BaseUrlApiConfiguration extends AbstractApiConfiguration {
    readonly baseUrl: UrlParts;
    protected readonly fixedHeadersValue: Record<string, string>;
    constructor({ baseUrl, headers, retry, throttle, customCallHeaders, }: BaseUrlPartsApiConfigurationOptions);
    fixedHeaders(): Record<string, string>;
    assembleUrl(path: string): string;
}
export type PartialBaseUrlPartsApiConfigurationOptions = Omit<BaseUrlPartsApiConfigurationOptions, "baseUrl"> & {
    baseUrl?: string | Partial<UrlParts>;
};
export declare class BaseUrlApiConfigurationWithDefaults extends BaseUrlApiConfiguration {
    constructor({ baseUrlDefaults, baseUrl, headers, retry, throttle, customCallHeaders, }: {
        baseUrlDefaults: UrlParts;
    } & PartialBaseUrlPartsApiConfigurationOptions);
}
