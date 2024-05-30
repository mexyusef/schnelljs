import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { countTokens } from "../../model-function/tokenize-text/countTokens.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { failedOpenAICallResponseHandler } from "./OpenAIError.js";
import { TikTokenTokenizer } from "./TikTokenTokenizer.js";
export const OPENAI_TEXT_EMBEDDING_MODELS = {
    "text-embedding-ada-002": {
        contextWindowSize: 8192,
        embeddingDimensions: 1536,
        tokenCostInMillicents: 0.01,
    },
};
export const isOpenAIEmbeddingModel = (model) => model in OPENAI_TEXT_EMBEDDING_MODELS;
export const calculateOpenAIEmbeddingCostInMillicents = ({ model, responses, }) => {
    let amountInMilliseconds = 0;
    for (const response of responses) {
        amountInMilliseconds +=
            response.usage.total_tokens *
                OPENAI_TEXT_EMBEDDING_MODELS[model].tokenCostInMillicents;
    }
    return amountInMilliseconds;
};
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany(
 *   new OpenAITextEmbeddingModel({ model: "text-embedding-ada-002" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export class OpenAITextEmbeddingModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "openai"
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
        Object.defineProperty(this, "tokenizer", {
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
        this.tokenizer = new TikTokenTokenizer({ model: this.modelName });
        this.contextWindowSize =
            OPENAI_TEXT_EMBEDDING_MODELS[this.modelName].contextWindowSize;
        this.embeddingDimensions =
            OPENAI_TEXT_EMBEDDING_MODELS[this.modelName].embeddingDimensions;
    }
    get modelName() {
        return this.settings.model;
    }
    get maxValuesPerCall() {
        return this.settings.maxValuesPerCall ?? 2048;
    }
    async countTokens(input) {
        return countTokens(this.tokenizer, input);
    }
    async callAPI(texts, callOptions) {
        const api = this.settings.api ?? new OpenAIApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl("/embeddings"),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    model: this.modelName,
                    input: texts,
                    user: this.settings.isUserIdForwardingEnabled
                        ? callOptions.run?.userId
                        : undefined,
                },
                failedResponseHandler: failedOpenAICallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(openAITextEmbeddingResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {};
    }
    async doEmbedValues(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The OpenAI embedding API only supports ${this.maxValuesPerCall} texts per API call.`);
        }
        const rawResponse = await this.callAPI(texts, callOptions);
        return {
            rawResponse,
            embeddings: rawResponse.data.map((data) => data.embedding),
        };
    }
    withSettings(additionalSettings) {
        return new OpenAITextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const openAITextEmbeddingResponseSchema = z.object({
    object: z.literal("list"),
    data: z.array(z.object({
        object: z.literal("embedding"),
        embedding: z.array(z.number()),
        index: z.number(),
    })),
    model: z.string(),
    usage: z.object({
        prompt_tokens: z.number(),
        total_tokens: z.number(),
    }),
});
