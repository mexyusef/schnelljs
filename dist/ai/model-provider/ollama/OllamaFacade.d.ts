import { PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
import { OllamaApiConfiguration } from "./OllamaApiConfiguration.js";
import { OllamaChatModel, OllamaChatModelSettings } from "./OllamaChatModel.js";
import { OllamaCompletionModel, OllamaCompletionModelSettings } from "./OllamaCompletionModel.js";
import { OllamaTextEmbeddingModel, OllamaTextEmbeddingModelSettings } from "./OllamaTextEmbeddingModel.js";
/**
 * Creates an API configuration for the Ollama API.
 * It calls the API at http://127.0.0.1:11434 by default.
 */
export declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions): OllamaApiConfiguration;
export declare function CompletionTextGenerator<CONTEXT_WINDOW_SIZE extends number>(settings: OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>): OllamaCompletionModel<CONTEXT_WINDOW_SIZE>;
export declare function ChatTextGenerator(settings: OllamaChatModelSettings): OllamaChatModel;
export declare function TextEmbedder(settings: OllamaTextEmbeddingModelSettings): OllamaTextEmbeddingModel;
export { OllamaChatMessage as ChatMessage, OllamaChatPrompt as ChatPrompt, } from "./OllamaChatModel.js";
export * as prompt from "./OllamaCompletionPrompt.js";
