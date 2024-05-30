import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
import { LlamaCppApiConfiguration } from "./LlamaCppApiConfiguration.js";
import { LlamaCppCompletionModel, LlamaCppCompletionModelSettings } from "./LlamaCppCompletionModel.js";
import { LlamaCppTextEmbeddingModel, LlamaCppTextEmbeddingModelSettings } from "./LlamaCppTextEmbeddingModel.js";
import { LlamaCppTokenizer } from "./LlamaCppTokenizer.js";
/**
 * Creates an API configuration for the Llama.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
export declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions): LlamaCppApiConfiguration;
export declare function CompletionTextGenerator<CONTEXT_WINDOW_SIZE extends number>(settings?: LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>): LlamaCppCompletionModel<CONTEXT_WINDOW_SIZE>;
export declare function TextEmbedder(settings?: LlamaCppTextEmbeddingModelSettings): LlamaCppTextEmbeddingModel;
export declare function Tokenizer(api?: ApiConfiguration): LlamaCppTokenizer;
/**
 * GBNF grammars. You can use them in the `grammar` option of the `TextGenerator` model.
 */
export * as grammar from "./LlamaCppGrammars.js";
export * as prompt from "./LlamaCppPrompt.js";
