import { AbstractApiConfiguration } from "../../core/api/AbstractApiConfiguration.js";
import { loadApiKey } from "../../core/api/loadApiKey.js";
/**
 * Configuration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
export class AzureOpenAIApiConfiguration extends AbstractApiConfiguration {
    constructor({ resourceName, deploymentId, apiVersion, apiKey, retry, throttle, }) {
        super({ retry, throttle });
        Object.defineProperty(this, "resourceName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "deploymentId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fixedHeaderValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.resourceName = resourceName;
        this.deploymentId = deploymentId;
        this.apiVersion = apiVersion;
        this.fixedHeaderValue = {
            "api-key": loadApiKey({
                apiKey,
                environmentVariableName: "AZURE_OPENAI_API_KEY",
                description: "Azure OpenAI",
            }),
        };
    }
    assembleUrl(path) {
        return `https://${this.resourceName}.openai.azure.com/openai/deployments/${this.deploymentId}${path}?api-version=${this.apiVersion}`;
    }
    fixedHeaders() {
        return this.fixedHeaderValue;
    }
}
