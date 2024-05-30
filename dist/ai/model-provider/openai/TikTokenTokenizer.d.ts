import { FullTokenizer } from "../../model-function/tokenize-text/Tokenizer.js";
import { OpenAIChatBaseModelType } from "./OpenAIChatModel.js";
import { OpenAICompletionModelType } from "./OpenAICompletionModel.js";
import { OpenAITextEmbeddingModelType } from "./OpenAITextEmbeddingModel.js";
export type TikTokenTokenizerSettings = {
    model: OpenAIChatBaseModelType | OpenAICompletionModelType | OpenAITextEmbeddingModelType;
};
/**
 * TikToken tokenizer for OpenAI language models.
 *
 * @see https://github.com/openai/tiktoken
 *
 * @example
 * const tokenizer = new TikTokenTokenizer({ model: "gpt-4" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
export declare class TikTokenTokenizer implements FullTokenizer {
    /**
     * Get a TikToken tokenizer for a specific model or encoding.
     */
    constructor(settings: TikTokenTokenizerSettings);
    private readonly tiktoken;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
}
