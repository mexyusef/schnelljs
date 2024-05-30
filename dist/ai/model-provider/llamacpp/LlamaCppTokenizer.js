import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { LlamaCppApiConfiguration } from "./LlamaCppApiConfiguration.js";
import { failedLlamaCppCallResponseHandler } from "./LlamaCppError.js";
/**
 * Tokenizer for LlamaCpp.

 * @example
 * const tokenizer = new LlamaCppTokenizer();
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
export class LlamaCppTokenizer {
    constructor(api = new LlamaCppApiConfiguration()) {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.api = api;
    }
    async callTokenizeAPI(text, callOptions) {
        const api = this.api;
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
                    content: text,
                },
                failedResponseHandler: failedLlamaCppCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(llamaCppTokenizationResponseSchema)),
                abortSignal,
            }),
        });
    }
    async tokenize(text) {
        const response = await this.callTokenizeAPI(text);
        return response.tokens;
    }
}
const llamaCppTokenizationResponseSchema = z.object({
    tokens: z.array(z.number()),
});
