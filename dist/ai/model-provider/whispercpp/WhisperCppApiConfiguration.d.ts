import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the Whisper.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
export declare class WhisperCppApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}
