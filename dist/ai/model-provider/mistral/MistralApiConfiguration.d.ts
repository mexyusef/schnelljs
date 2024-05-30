import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the Mistral API.
 * It calls the API at https://api.mistral.ai/v1 and uses the `MISTRAL_API_KEY` env variable by default.
 */
export declare class MistralApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
