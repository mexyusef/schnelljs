import { BaseUrlApiConfigurationWithDefaults, } from "../../core/api/BaseUrlApiConfiguration.js";
import { loadApiKey } from "../../core/api/loadApiKey.js";
/**
 * Creates an API configuration for the Stability AI API.
 * It calls the API at https://api.stability.ai/v1 by default and uses the `STABILITY_API_KEY` environment variable.
 */
export class StabilityApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings = {}) {
        super({
            ...settings,
            headers: settings.headers ?? {
                Authorization: `Bearer ${loadApiKey({
                    apiKey: settings.apiKey,
                    environmentVariableName: "STABILITY_API_KEY",
                    description: "Stability",
                })}`,
            },
            baseUrlDefaults: {
                protocol: "https",
                host: "api.stability.ai",
                port: "443",
                path: "/v1",
            },
        });
    }
}
