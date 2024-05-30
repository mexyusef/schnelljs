import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for ElevenLabs API.
 * It calls the API at https://api.elevenlabs.io/v1 and uses the `ELEVENLABS_API_KEY` env variable by default.
 */
export declare class ElevenLabsApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
    get apiKey(): string;
}
