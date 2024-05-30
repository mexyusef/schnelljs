import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { CohereApiConfiguration } from "./CohereApiConfiguration.js";
import { failedCohereCallResponseHandler } from "./CohereError.js";
/**
 * Tokenizer for the Cohere models. It uses the Co.Tokenize and Co.Detokenize APIs.
 *
 * @see https://docs.cohere.com/reference/tokenize
 * @see https://docs.cohere.com/reference/detokenize
 *
 * @example
 * const tokenizer = new CohereTokenizer({ model: "command" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
export class CohereTokenizer {
    constructor(settings) {
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.settings = settings;
    }
    async callTokenizeAPI(text, callOptions) {
        const api = this.settings.api ?? new CohereApiConfiguration();
        const abortSignal = callOptions?.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/tokenize`),
                headers: api.headers({
                    functionType: "tokenize",
                    functionId: callOptions?.functionId,
                    run: callOptions?.run,
                    callId: "",
                }),
                body: {
                    model: this.settings.model,
                    text,
                },
                failedResponseHandler: failedCohereCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(cohereTokenizationResponseSchema)),
                abortSignal,
            }),
        });
    }
    async callDeTokenizeAPI(tokens, callOptions) {
        const api = this.settings.api ?? new CohereApiConfiguration();
        const abortSignal = callOptions?.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/detokenize`),
                headers: api.headers({
                    functionType: "detokenize",
                    functionId: callOptions?.functionId,
                    run: callOptions?.run,
                    callId: "",
                }),
                body: {
                    model: this.settings.model,
                    tokens,
                },
                failedResponseHandler: failedCohereCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(cohereDetokenizationResponseSchema)),
                abortSignal,
            }),
        });
    }
    async tokenize(text) {
        return (await this.tokenizeWithTexts(text)).tokens;
    }
    async tokenizeWithTexts(text) {
        const response = await this.callTokenizeAPI(text);
        return {
            tokens: response.tokens,
            tokenTexts: response.token_strings,
        };
    }
    async detokenize(tokens) {
        const response = await this.callDeTokenizeAPI(tokens);
        return response.text;
    }
}
const cohereDetokenizationResponseSchema = z.object({
    text: z.string(),
    meta: z.object({
        api_version: z.object({
            version: z.string(),
        }),
    }),
});
const cohereTokenizationResponseSchema = z.object({
    tokens: z.array(z.number()),
    token_strings: z.array(z.string()),
    meta: z.object({
        api_version: z.object({
            version: z.string(),
        }),
    }),
});
