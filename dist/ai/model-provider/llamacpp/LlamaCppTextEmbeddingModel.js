import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { LlamaCppApiConfiguration } from "./LlamaCppApiConfiguration.js";
import { failedLlamaCppCallResponseHandler } from "./LlamaCppError.js";
import { LlamaCppTokenizer } from "./LlamaCppTokenizer.js";
export class LlamaCppTextEmbeddingModel extends AbstractModel {
    constructor(settings = {}) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "llamacpp"
        });
        Object.defineProperty(this, "maxValuesPerCall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "contextWindowSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tokenizer = new LlamaCppTokenizer(this.settings.api);
    }
    get modelName() {
        return null;
    }
    get isParallelizable() {
        return this.settings.isParallelizable ?? false;
    }
    get embeddingDimensions() {
        return this.settings.embeddingDimensions;
    }
    async tokenize(text) {
        return this.tokenizer.tokenize(text);
    }
    async callAPI(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The Llama.cpp embedding API only supports ${this.maxValuesPerCall} texts per API call.`);
        }
        const api = this.settings.api ?? new LlamaCppApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: this.settings.api?.retry,
            throttle: this.settings.api?.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/embedding`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: { content: texts[0] },
                failedResponseHandler: failedLlamaCppCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(llamaCppTextEmbeddingResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            embeddingDimensions: this.settings.embeddingDimensions,
        };
    }
    async doEmbedValues(texts, options) {
        const rawResponse = await this.callAPI(texts, options);
        return {
            rawResponse,
            embeddings: [rawResponse.embedding],
        };
    }
    withSettings(additionalSettings) {
        return new LlamaCppTextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const llamaCppTextEmbeddingResponseSchema = z.object({
    embedding: z.array(z.number()),
});
