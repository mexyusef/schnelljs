import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the OpenAI API.
 * It calls the API at https://api.openai.com/v1 and uses the `OPENAI_API_KEY` env variable by default.
 */
export declare class OpenAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
