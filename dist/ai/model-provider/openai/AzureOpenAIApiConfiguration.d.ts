import { AbstractApiConfiguration } from "../../core/api/AbstractApiConfiguration.js";
import { RetryFunction } from "../../core/api/RetryFunction.js";
import { ThrottleFunction } from "../../core/api/ThrottleFunction.js";
export type AzureOpenAIApiConfigurationOptions = {
    resourceName: string;
    deploymentId: string;
    apiVersion: string;
    apiKey?: string;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
};
/**
 * Configuration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
export declare class AzureOpenAIApiConfiguration extends AbstractApiConfiguration {
    readonly resourceName: string;
    readonly deploymentId: string;
    readonly apiVersion: string;
    readonly fixedHeaderValue: Record<string, string>;
    constructor({ resourceName, deploymentId, apiVersion, apiKey, retry, throttle, }: AzureOpenAIApiConfigurationOptions);
    assembleUrl(path: string): string;
    fixedHeaders(): Record<string, string>;
}
