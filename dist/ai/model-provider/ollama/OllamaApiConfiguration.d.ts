import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the Ollama API.
 * It calls the API at http://127.0.0.1:11434 by default.
 */
export declare class OllamaApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}
