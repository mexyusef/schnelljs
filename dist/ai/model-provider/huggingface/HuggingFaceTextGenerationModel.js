import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextGenerationModel } from "../../model-function/generate-text/PromptTemplateTextGenerationModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { HuggingFaceApiConfiguration } from "./HuggingFaceApiConfiguration.js";
import { failedHuggingFaceCallResponseHandler } from "./HuggingFaceError.js";
/**
 * Create a text generation model that calls a Hugging Face Inference API Text Generation Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "tiiuae/falcon-7b",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
export class HuggingFaceTextGenerationModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "huggingface"
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
            value: undefined
        });
        Object.defineProperty(this, "countPromptTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(prompt, callOptions) {
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
                    inputs: prompt,
                    top_k: this.settings.topK,
                    top_p: this.settings.topP,
                    temperature: this.settings.temperature,
                    repetition_penalty: this.settings.repetitionPenalty,
                    max_new_tokens: this.settings.maxGenerationTokens,
                    max_time: this.settings.maxTime,
                    num_return_sequences: this.settings.numberOfGenerations,
                    do_sample: this.settings.doSample,
                    options: {
                        use_cache: true,
                        wait_for_model: true,
                    },
                },
                failedResponseHandler: failedHuggingFaceCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(huggingFaceTextGenerationResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            ...textGenerationModelProperties,
            "topK",
            "topP",
            "temperature",
            "repetitionPenalty",
            "maxTime",
            "doSample",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(huggingFaceTextGenerationResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: rawResponse.map((response) => ({
                text: response.generated_text,
                finishReason: "unknown",
            })),
        };
    }
    withJsonOutput() {
        return this;
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateTextGenerationModel({
            model: this, // stop tokens are not supported by this model
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new HuggingFaceTextGenerationModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const huggingFaceTextGenerationResponseSchema = z.array(z.object({
    generated_text: z.string(),
}));
