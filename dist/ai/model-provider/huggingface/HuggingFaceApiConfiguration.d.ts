import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the HuggingFace API.
 * It calls the API at https://api-inference.huggingface.co/models and uses the `HUGGINGFACE_API_KEY` env variable by default.
 */
export declare class HuggingFaceApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
