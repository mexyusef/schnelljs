import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Configuration for the Together.ai API.
 *
 * It calls the API at https://api.together.xyz/v1 and uses the `TOGETHER_API_KEY` api key environment variable.
 *
 * @see https://docs.together.ai/docs/openai-api-compatibility
 */
export declare class TogetherAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
