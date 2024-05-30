import { LlamaCppApiConfiguration } from "./LlamaCppApiConfiguration.js";
import { LlamaCppCompletionModel, } from "./LlamaCppCompletionModel.js";
import { LlamaCppTextEmbeddingModel, } from "./LlamaCppTextEmbeddingModel.js";
import { LlamaCppTokenizer } from "./LlamaCppTokenizer.js";
/**
 * Creates an API configuration for the Llama.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
export function Api(settings) {
    return new LlamaCppApiConfiguration(settings);
}
export function CompletionTextGenerator(settings = {}) {
    return new LlamaCppCompletionModel(settings);
}
export function TextEmbedder(settings = {}) {
    return new LlamaCppTextEmbeddingModel(settings);
}
export function Tokenizer(api = new LlamaCppApiConfiguration()) {
    return new LlamaCppTokenizer(api);
}
/**
 * GBNF grammars. You can use them in the `grammar` option of the `TextGenerator` model.
 */
export * as grammar from "./LlamaCppGrammars.js";
export * as prompt from "./LlamaCppPrompt.js";
