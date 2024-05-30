import { z } from "zod";
import { ApiCallError } from "../../core/api/ApiCallError.js";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { postJsonToApi } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { safeParseJSON } from "../../core/schema/parseJSON.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationToolCallModel, } from "../../tool/generate-tool-call/TextGenerationToolCallModel.js";
import { TextGenerationToolCallsModel } from "../../tool/generate-tool-calls/TextGenerationToolCallsModel.js";
import { createJsonStreamResponseHandler } from "../../util/streaming/createJsonStreamResponseHandler.js";
import { OllamaApiConfiguration } from "./OllamaApiConfiguration.js";
import { Text } from "./OllamaCompletionPrompt.js";
import { failedOllamaCallResponseHandler } from "./OllamaError.js";
export class OllamaCompletionModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ollama"
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
    get contextWindowSize() {
        return this.settings.contextWindowSize;
    }
    async callAPI(prompt, callOptions, options) {
        const { responseFormat } = options;
        const api = this.settings.api ?? new OllamaApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/api/generate`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    stream: responseFormat.stream,
                    model: this.settings.model,
                    prompt: prompt.prompt,
                    images: prompt.images,
                    format: this.settings.format,
                    options: {
                        mirostat: this.settings.mirostat,
                        mirostat_eta: this.settings.mirostatEta,
                        mirostat_tau: this.settings.mirostatTau,
                        num_ctx: this.settings.contextWindowSize,
                        num_gpu: this.settings.numGpu,
                        num_gqa: this.settings.numGqa,
                        num_predict: this.settings.maxGenerationTokens,
                        num_threads: this.settings.numThreads,
                        repeat_last_n: this.settings.repeatLastN,
                        repeat_penalty: this.settings.repeatPenalty,
                        seed: this.settings.seed,
                        stop: this.settings.stopSequences,
                        temperature: this.settings.temperature,
                        tfs_z: this.settings.tfsZ,
                        top_k: this.settings.topK,
                        top_p: this.settings.topP,
                    },
                    system: this.settings.system,
                    template: this.settings.template,
                    context: this.settings.context,
                    raw: this.settings.raw,
                },
                failedResponseHandler: failedOllamaCallResponseHandler,
                successfulResponseHandler: responseFormat.handler,
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            ...textGenerationModelProperties,
            "contextWindowSize",
            "temperature",
            "mirostat",
            "mirostatEta",
            "mirostatTau",
            "numGqa",
            "numGpu",
            "numThreads",
            "repeatLastN",
            "repeatPenalty",
            "seed",
            "tfsZ",
            "topK",
            "topP",
            "system",
            "template",
            "context",
            "format",
            "raw",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options, {
            responseFormat: OllamaCompletionResponseFormat.json,
        }));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(ollamaCompletionResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: [
                {
                    text: rawResponse.response,
                    finishReason: "unknown",
                },
            ],
        };
    }
    doStreamText(prompt, options) {
        return this.callAPI(prompt, options, {
            ...options,
            responseFormat: OllamaCompletionResponseFormat.deltaIterable,
        });
    }
    extractTextDelta(delta) {
        const chunk = delta;
        return chunk.done === true ? undefined : chunk.response;
    }
    asStructureGenerationModel(promptTemplate) {
        return "adaptModel" in promptTemplate
            ? new StructureFromTextStreamingModel({
                model: promptTemplate.adaptModel(this),
                template: promptTemplate,
            })
            : new StructureFromTextStreamingModel({
                model: this,
                template: promptTemplate,
            });
    }
    asToolCallGenerationModel(promptTemplate) {
        return new TextGenerationToolCallModel({
            model: this,
            format: promptTemplate,
        });
    }
    asToolCallsOrTextGenerationModel(promptTemplate) {
        return new TextGenerationToolCallsModel({
            model: this,
            template: promptTemplate,
        });
    }
    get promptTemplateProvider() {
        return this.settings.promptTemplate ?? Text;
    }
    withJsonOutput() {
        return this;
    }
    withTextPrompt() {
        return this.withPromptTemplate(this.promptTemplateProvider.text());
    }
    withInstructionPrompt() {
        return this.withPromptTemplate(this.promptTemplateProvider.instruction());
    }
    withChatPrompt() {
        return this.withPromptTemplate(this.promptTemplateProvider.chat());
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
        return new OllamaCompletionModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const ollamaCompletionResponseSchema = z.object({
    done: z.literal(true),
    model: z.string(),
    created_at: z.string(),
    response: z.string(),
    total_duration: z.number(),
    load_duration: z.number().optional(),
    prompt_eval_count: z.number().optional(),
    prompt_eval_duration: z.number().optional(),
    eval_count: z.number(),
    eval_duration: z.number(),
    context: z.array(z.number()).optional(),
});
const ollamaCompletionStreamChunkSchema = z.discriminatedUnion("done", [
    z.object({
        done: z.literal(false),
        model: z.string(),
        created_at: z.string(),
        response: z.string(),
    }),
    z.object({
        done: z.literal(true),
        model: z.string(),
        created_at: z.string(),
        total_duration: z.number(),
        load_duration: z.number().optional(),
        sample_count: z.number().optional(),
        sample_duration: z.number().optional(),
        prompt_eval_count: z.number(),
        prompt_eval_duration: z.number().optional(),
        eval_count: z.number(),
        eval_duration: z.number(),
        context: z.array(z.number()).optional(),
    }),
]);
export const OllamaCompletionResponseFormat = {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false,
        handler: (async ({ response, url, requestBodyValues }) => {
            const responseBody = await response.text();
            const parsedResult = safeParseJSON({
                text: responseBody,
                schema: zodSchema(z.union([
                    ollamaCompletionResponseSchema,
                    z.object({
                        done: z.literal(false),
                        model: z.string(),
                        created_at: z.string(),
                        response: z.string(),
                    }),
                ])),
            });
            if (!parsedResult.success) {
                throw new ApiCallError({
                    message: "Invalid JSON response",
                    cause: parsedResult.error,
                    statusCode: response.status,
                    responseBody,
                    url,
                    requestBodyValues,
                });
            }
            if (parsedResult.data.done === false) {
                throw new ApiCallError({
                    message: "Incomplete Ollama response received",
                    statusCode: response.status,
                    responseBody,
                    url,
                    requestBodyValues,
                    isRetryable: true,
                });
            }
            return parsedResult.data;
        }),
    },
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: true,
        handler: createJsonStreamResponseHandler(zodSchema(ollamaCompletionStreamChunkSchema)),
    },
};
