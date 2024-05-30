import { PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
import { MistralApiConfiguration } from "./MistralApiConfiguration.js";
import { MistralChatModel, MistralChatModelSettings } from "./MistralChatModel.js";
import { MistralTextEmbeddingModel, MistralTextEmbeddingModelSettings } from "./MistralTextEmbeddingModel.js";
/**
 * Creates an API configuration for the Mistral API.
 * It calls the API at https://api.mistral.ai/v1 and uses the `MISTRAL_API_KEY` env variable by default.
 */
export declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): MistralApiConfiguration;
export declare function ChatTextGenerator(settings: MistralChatModelSettings): MistralChatModel;
export declare function TextEmbedder(settings: MistralTextEmbeddingModelSettings): MistralTextEmbeddingModel;
export { MistralChatMessage as ChatMessage, MistralChatPrompt as ChatPrompt, } from "./MistralChatModel.js";
