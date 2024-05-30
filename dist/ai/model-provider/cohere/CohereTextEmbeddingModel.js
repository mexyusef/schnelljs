import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { CohereApiConfiguration } from "./CohereApiConfiguration.js";
import { failedCohereCallResponseHandler } from "./CohereError.js";
import { CohereTokenizer } from "./CohereTokenizer.js";
export const COHERE_TEXT_EMBEDDING_MODELS = {
    "embed-english-light-v2.0": {
        contextWindowSize: 512,
        embeddingDimensions: 1024,
    },
    "embed-english-v2.0": {
        contextWindowSize: 512,
        embeddingDimensions: 4096,
    },
    "embed-multilingual-v2.0": {
        contextWindowSize: 256,
        embeddingDimensions: 768,
    },
    "embed-english-v3.0": {
        contextWindowSize: 512,
        embeddingDimensions: 1024,
    },
    "embed-english-light-v3.0": {
        contextWindowSize: 512,
        embeddingDimensions: 384,
    },
    "embed-multilingual-v3.0": {
        contextWindowSize: 512,
        embeddingDimensions: 1024,
    },
    "embed-multilingual-light-v3.0": {
        contextWindowSize: 512,
        embeddingDimensions: 384,
    },
};
/**
 * Create a text embedding model that calls the Cohere Co.Embed API.
 *
 * @see https://docs.cohere.com/reference/embed
 *
 * @example
 * const embeddings = await embedMany(
 *   new CohereTextEmbeddingModel({ model: "embed-english-light-v2.0" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export class CohereTextEmbeddingModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "cohere"
        });
        Object.defineProperty(this, "maxValuesPerCall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 96
        });
        Object.defineProperty(this, "isParallelizable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "embeddingDimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contextWindowSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.contextWindowSize =
            COHERE_TEXT_EMBEDDING_MODELS[this.modelName].contextWindowSize;
        this.tokenizer = new CohereTokenizer({
            api: this.settings.api,
            model: this.settings.model,
        });
        this.embeddingDimensions =
            COHERE_TEXT_EMBEDDING_MODELS[this.modelName].embeddingDimensions;
    }
    get modelName() {
        return this.settings.model;
    }
    async tokenize(text) {
        return this.tokenizer.tokenize(text);
    }
    async tokenizeWithTexts(text) {
        return this.tokenizer.tokenizeWithTexts(text);
    }
    async detokenize(tokens) {
        return this.tokenizer.detokenize(tokens);
    }
    async callAPI(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The Cohere embedding API only supports ${this.maxValuesPerCall} texts per API call.`);
        }
        const api = this.settings.api ?? new CohereApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/embed`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    model: this.settings.model,
                    texts,
                    input_type: this.settings.inputType,
                    truncate: this.settings.truncate,
                },
                failedResponseHandler: failedCohereCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(cohereTextEmbeddingResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            truncate: this.settings.truncate,
        };
    }
    async doEmbedValues(texts, options) {
        const rawResponse = await this.callAPI(texts, options);
        return {
            rawResponse,
            embeddings: rawResponse.embeddings,
        };
    }
    withSettings(additionalSettings) {
        return new CohereTextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const cohereTextEmbeddingResponseSchema = z.object({
    id: z.string(),
    texts: z.array(z.string()),
    embeddings: z.array(z.array(z.number())),
    meta: z.object({
        api_version: z.object({
            version: z.string(),
        }),
    }),
});
