import { MistralApiConfiguration } from "./MistralApiConfiguration.js";
import { MistralChatModel, } from "./MistralChatModel.js";
import { MistralTextEmbeddingModel, } from "./MistralTextEmbeddingModel.js";
/**
 * Creates an API configuration for the Mistral API.
 * It calls the API at https://api.mistral.ai/v1 and uses the `MISTRAL_API_KEY` env variable by default.
 */
export function Api(settings) {
    return new MistralApiConfiguration(settings);
}
export function ChatTextGenerator(settings) {
    return new MistralChatModel(settings);
}
export function TextEmbedder(settings) {
    return new MistralTextEmbeddingModel(settings);
}
