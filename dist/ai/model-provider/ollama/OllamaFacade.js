import { OllamaApiConfiguration } from "./OllamaApiConfiguration.js";
import { OllamaChatModel } from "./OllamaChatModel.js";
import { OllamaCompletionModel, } from "./OllamaCompletionModel.js";
import { OllamaTextEmbeddingModel, } from "./OllamaTextEmbeddingModel.js";
/**
 * Creates an API configuration for the Ollama API.
 * It calls the API at http://127.0.0.1:11434 by default.
 */
export function Api(settings) {
    return new OllamaApiConfiguration(settings);
}
export function CompletionTextGenerator(settings) {
    return new OllamaCompletionModel(settings);
}
export function ChatTextGenerator(settings) {
    return new OllamaChatModel(settings);
}
export function TextEmbedder(settings) {
    return new OllamaTextEmbeddingModel(settings);
}
export * as prompt from "./OllamaCompletionPrompt.js";
