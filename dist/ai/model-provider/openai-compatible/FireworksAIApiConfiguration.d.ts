import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Configuration for the Fireworks.ai API.
 *
 * It calls the API at https://api.fireworks.ai/inference/v1 and uses the `FIREWORKS_API_KEY` api key environment variable.
 *
 * @see https://readme.fireworks.ai/docs/openai-compatibility
 */
export declare class FireworksAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
