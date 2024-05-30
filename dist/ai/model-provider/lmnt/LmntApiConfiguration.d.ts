import { BaseUrlApiConfigurationWithDefaults, PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
/**
 * Creates an API configuration for the LMNT API.
 * It calls the API at https://api.lmnt.com/v1 and uses the `LMNT_API_KEY` env variable by default.
 */
export declare class LmntApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}
