import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { chat, instruction, } from "../../model-function/generate-text/prompt-template/TextPromptTemplate.js";
import { countTokens } from "../../model-function/tokenize-text/countTokens.js";
import { createJsonStreamResponseHandler } from "../../util/streaming/createJsonStreamResponseHandler.js";
import { CohereApiConfiguration } from "./CohereApiConfiguration.js";
import { failedCohereCallResponseHandler } from "./CohereError.js";
import { CohereTokenizer } from "./CohereTokenizer.js";
export const COHERE_TEXT_GENERATION_MODELS = {
    command: {
        contextWindowSize: 4096,
    },
    "command-light": {
        contextWindowSize: 4096,
    },
};
/**
 * Create a text generation model that calls the Cohere Co.Generate API.
 *
 * @see https://docs.cohere.com/reference/generate
 *
 * @example
 * const model = new CohereTextGenerationModel({
 *   model: "command",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText(
 *    model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
export class CohereTextGenerationModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "cohere"
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
            COHERE_TEXT_GENERATION_MODELS[this.settings.model].contextWindowSize;
        this.tokenizer = new CohereTokenizer({
            api: this.settings.api,
            model: this.settings.model,
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async countPromptTokens(input) {
        return countTokens(this.tokenizer, input);
    }
    async callAPI(prompt, callOptions, options) {
        const api = this.settings.api ?? new CohereApiConfiguration();
        const responseFormat = options.responseFormat;
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/generate`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    stream: responseFormat.stream,
                    model: this.settings.model,
                    prompt,
                    num_generations: this.settings.numberOfGenerations,
                    max_tokens: this.settings.maxGenerationTokens,
                    temperature: this.settings.temperature,
                    k: this.settings.k,
                    p: this.settings.p,
                    frequency_penalty: this.settings.frequencyPenalty,
                    presence_penalty: this.settings.presencePenalty,
                    end_sequences: this.settings.stopSequences,
                    stop_sequences: this.settings.cohereStopSequences,
                    return_likelihoods: this.settings.returnLikelihoods,
                    logit_bias: this.settings.logitBias,
                    truncate: this.settings.truncate,
                },
                failedResponseHandler: failedCohereCallResponseHandler,
                successfulResponseHandler: responseFormat.handler,
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            ...textGenerationModelProperties,
            "temperature",
            "k",
            "p",
            "frequencyPenalty",
            "presencePenalty",
            "returnLikelihoods",
            "logitBias",
            "truncate",
            "cohereStopSequences",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options, {
            responseFormat: CohereTextGenerationResponseFormat.json,
        }));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(cohereTextGenerationResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: rawResponse.generations.map((generation) => ({
                text: generation.text,
                finishReason: this.translateFinishReason(generation.finish_reason),
            })),
        };
    }
    translateFinishReason(finishReason) {
        switch (finishReason) {
            case "COMPLETE":
                return "stop";
            case "MAX_TOKENS":
                return "length";
            case "ERROR_TOXIC":
                return "content-filter";
            case "ERROR":
                return "error";
            default:
                return "unknown";
        }
    }
    doStreamText(prompt, options) {
        return this.callAPI(prompt, options, {
            responseFormat: CohereTextGenerationResponseFormat.deltaIterable,
        });
    }
    extractTextDelta(delta) {
        const chunk = delta;
        return chunk.is_finished === true ? "" : chunk.text;
    }
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt() {
        return this.withPromptTemplate(instruction());
    }
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(options) {
        return this.withPromptTemplate(chat(options));
    }
    withJsonOutput() {
        return this;
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateTextStreamingModel({
            model: this.withSettings({
                stopSequences: [
                    ...(this.settings.stopSequences ?? []),
                    ...promptTemplate.stopSequences,
                ],
            }),
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new CohereTextGenerationModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const cohereTextGenerationResponseSchema = z.object({
    id: z.string(),
    generations: z.array(z.object({
        id: z.string(),
        text: z.string(),
        finish_reason: z.string().optional(),
    })),
    prompt: z.string(),
    meta: z
        .object({
        api_version: z.object({
            version: z.string(),
        }),
    })
        .optional(),
});
const cohereTextStreamChunkSchema = z.discriminatedUnion("is_finished", [
    z.object({
        text: z.string(),
        is_finished: z.literal(false),
    }),
    z.object({
        is_finished: z.literal(true),
        finish_reason: z.string(),
        response: cohereTextGenerationResponseSchema,
    }),
]);
export const CohereTextGenerationResponseFormat = {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false,
        handler: createJsonResponseHandler(zodSchema(cohereTextGenerationResponseSchema)),
    },
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: true,
        handler: createJsonStreamResponseHandler(zodSchema(cohereTextStreamChunkSchema)),
    },
};
