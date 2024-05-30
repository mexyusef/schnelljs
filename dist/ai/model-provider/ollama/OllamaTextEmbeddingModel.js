import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { OllamaApiConfiguration } from "./OllamaApiConfiguration.js";
import { failedOllamaCallResponseHandler } from "./OllamaError.js";
export class OllamaTextEmbeddingModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ollama"
        });
        Object.defineProperty(this, "maxValuesPerCall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
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
    async callAPI(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The Ollama embedding API only supports ${this.maxValuesPerCall} texts per API call.`);
        }
        const api = this.settings.api ?? new OllamaApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/api/embeddings`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    model: this.settings.model,
                    prompt: texts[0],
                },
                failedResponseHandler: failedOllamaCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(ollamaTextEmbeddingResponseSchema)),
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
        return new OllamaTextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const ollamaTextEmbeddingResponseSchema = z.object({
    embedding: z.array(z.number()),
});
