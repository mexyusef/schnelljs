import { BaseUrlApiConfiguration } from "../../core/api/BaseUrlApiConfiguration.js";
import { CustomHeaderProvider } from "../../core/api/CustomHeaderProvider.js";
import { RetryFunction } from "../../core/api/RetryFunction.js";
import { ThrottleFunction } from "../../core/api/ThrottleFunction.js";
export declare class HeliconeOpenAIApiConfiguration extends BaseUrlApiConfiguration {
    constructor({ baseUrl, openAIApiKey, heliconeApiKey, retry, throttle, customCallHeaders, }?: {
        baseUrl?: string;
        openAIApiKey?: string;
        heliconeApiKey?: string;
        retry?: RetryFunction;
        throttle?: ThrottleFunction;
        customCallHeaders?: CustomHeaderProvider;
    });
}
