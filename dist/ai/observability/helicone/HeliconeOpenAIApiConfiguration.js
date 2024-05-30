import { BaseUrlApiConfiguration } from "../../core/api/BaseUrlApiConfiguration.js";
import { loadApiKey } from "../../core/api/loadApiKey.js";
export class HeliconeOpenAIApiConfiguration extends BaseUrlApiConfiguration {
    constructor({ baseUrl = "https://oai.hconeai.com/v1", openAIApiKey, heliconeApiKey, retry, throttle, customCallHeaders, } = {}) {
        super({
            baseUrl,
            headers: {
                Authorization: `Bearer ${loadApiKey({
                    apiKey: openAIApiKey,
                    environmentVariableName: "OPENAI_API_KEY",
                    apiKeyParameterName: "openAIApiKey",
                    description: "OpenAI",
                })}`,
                "Helicone-Auth": `Bearer ${loadApiKey({
                    apiKey: heliconeApiKey,
                    environmentVariableName: "HELICONE_API_KEY",
                    apiKeyParameterName: "heliconeApiKey",
                    description: "Helicone",
                })}`,
            },
            retry,
            throttle,
            customCallHeaders,
        });
    }
}
