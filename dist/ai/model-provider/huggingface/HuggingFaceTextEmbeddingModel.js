import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { HuggingFaceApiConfiguration } from "./HuggingFaceApiConfiguration.js";
import { failedHuggingFaceCallResponseHandler } from "./HuggingFaceError.js";
/**
 * Create a text embedding model that calls a Hugging Face Inference API Feature Extraction Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#feature-extraction-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "intfloat/e5-base-v2",
 *   maxTexstsPerCall: 5,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const embeddings = await embedMany(
 *   model,
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export class HuggingFaceTextEmbeddingModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "huggingface"
        });
        Object.defineProperty(this, "maxValuesPerCall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isParallelizable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "contextWindowSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
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
            value: undefined
        });
        Object.defineProperty(this, "countPromptTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        // There is no limit documented in the HuggingFace API. Use 1024 as a reasonable default.
        this.maxValuesPerCall = settings.maxValuesPerCall ?? 1024;
        this.embeddingDimensions = settings.embeddingDimensions;
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(texts, callOptions) {
        if (texts.length > this.maxValuesPerCall) {
            throw new Error(`The HuggingFace feature extraction API is configured to only support ${this.maxValuesPerCall} texts per API call.`);
        }
        const api = this.settings.api ?? new HuggingFaceApiConfiguration();
        const abortSignal = callOptions?.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/${this.settings.model}`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    inputs: texts,
                    options: {
                        use_cache: this.settings.options?.useCache ?? true,
                        wait_for_model: this.settings.options?.waitForModel ?? true,
                    },
                },
                failedResponseHandler: failedHuggingFaceCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(huggingFaceTextEmbeddingResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            embeddingDimensions: this.settings.embeddingDimensions,
            options: this.settings.options,
        };
    }
    async doEmbedValues(texts, options) {
        const rawResponse = await this.callAPI(texts, options);
        return {
            rawResponse,
            embeddings: rawResponse,
        };
    }
    withSettings(additionalSettings) {
        return new HuggingFaceTextEmbeddingModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const huggingFaceTextEmbeddingResponseSchema = z.array(z.array(z.number()));
