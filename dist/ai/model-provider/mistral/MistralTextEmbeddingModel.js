import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { MistralApiConfiguration } from "./MistralApiConfiguration.js";
import { failedMistralCallResponseHandler } from "./MistralError.js";
export class MistralTextEmbeddingModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "mistral"
        });
        Object.defineProperty(this, "maxValuesPerCall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 32
        });
        /**
         * Parallel calls are technically possible, but I have been hitting rate limits and disabled
         * them for now.
         */
        Object.defineProperty(this, "isParallelizable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "embeddingDimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1024
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The Mistral embedding API only supports ${this.maxValuesPerCall} texts per API call.`);
        }
        const api = this.settings.api ?? new MistralApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        const model = this.settings.model;
        const encodingFormat = this.settings.encodingFormat ?? "float";
        return callWithRetryAndThrottle({
            retry: this.settings.api?.retry,
            throttle: this.settings.api?.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/embeddings`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    model,
                    input: texts,
                    encoding_format: encodingFormat,
                },
                failedResponseHandler: failedMistralCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(MistralTextEmbeddingResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            encodingFormat: this.settings.encodingFormat,
        };
    }
    async doEmbedValues(texts, options) {
        const rawResponse = await this.callAPI(texts, options);
        return {
            rawResponse,
            embeddings: rawResponse.data.map((entry) => entry.embedding),
        };
    }
    withSettings(additionalSettings) {
        return new MistralTextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const MistralTextEmbeddingResponseSchema = z.object({
    id: z.string(),
    object: z.string(),
    data: z.array(z.object({
        object: z.string(),
        embedding: z.array(z.number()),
        index: z.number(),
    })),
    model: z.string(),
    usage: z.object({
        prompt_tokens: z.number(),
        total_tokens: z.number(),
    }),
});
