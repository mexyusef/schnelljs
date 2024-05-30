import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";
import { never } from "../../util/never.js";
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
export class TikTokenTokenizer {
    /**
     * Get a TikToken tokenizer for a specific model or encoding.
     */
    constructor(settings) {
        Object.defineProperty(this, "tiktoken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tiktoken = new Tiktoken(getTiktokenBPE(settings.model));
    }
    async tokenize(text) {
        return this.tiktoken.encode(text);
    }
    async tokenizeWithTexts(text) {
        const tokens = this.tiktoken.encode(text);
        return {
            tokens,
            tokenTexts: tokens.map((token) => this.tiktoken.decode([token])),
        };
    }
    async detokenize(tokens) {
        return this.tiktoken.decode(tokens);
    }
}
// implemented here (instead of using js-tiktoken) to be able to quickly updated it
// when new models are released
function getTiktokenBPE(model) {
    switch (model) {
        case "gpt-3.5-turbo":
        case "gpt-3.5-turbo-0301":
        case "gpt-3.5-turbo-0613":
        case "gpt-3.5-turbo-1106":
        case "gpt-3.5-turbo-16k":
        case "gpt-3.5-turbo-16k-0613":
        case "gpt-3.5-turbo-instruct":
        case "gpt-4":
        case "gpt-4-0314":
        case "gpt-4-0613":
        case "gpt-4-1106-preview":
        case "gpt-4-vision-preview":
        case "gpt-4-32k":
        case "gpt-4-32k-0314":
        case "gpt-4-32k-0613":
        case "text-embedding-ada-002": {
            return cl100k_base;
        }
        default: {
            never(model);
            throw new Error(`Unknown model: ${model}`);
        }
    }
}
