import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { parseJSON } from "../../core/schema/parseJSON.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { AsyncQueue } from "../../util/AsyncQueue.js";
import { parseEventSourceStream } from "../../util/streaming/parseEventSourceStream.js";
import { LlamaCppApiConfiguration } from "./LlamaCppApiConfiguration.js";
import { failedLlamaCppCallResponseHandler } from "./LlamaCppError.js";
import { Text } from "./LlamaCppPrompt.js";
import { LlamaCppTokenizer } from "./LlamaCppTokenizer.js";
import { convertJsonSchemaToGBNF } from "./convertJsonSchemaToGBNF.js";
export class LlamaCppCompletionModel extends AbstractModel {
    constructor(settings = {}) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "llamacpp"
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
    get contextWindowSize() {
        return this.settings.contextWindowSize;
    }
    async callAPI(prompt, callOptions, options) {
        const api = this.settings.api ?? new LlamaCppApiConfiguration();
        const responseFormat = options.responseFormat;
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/completion`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    stream: responseFormat.stream,
                    prompt: prompt.text,
                    image_data: prompt.images != null
                        ? Object.entries(prompt.images).map(([id, data]) => ({
                            id: +id,
                            data,
                        }))
                        : undefined,
                    temperature: this.settings.temperature,
                    top_k: this.settings.topK,
                    top_p: this.settings.topP,
                    min_p: this.settings.minP,
                    n_predict: this.settings.maxGenerationTokens,
                    n_keep: this.settings.nKeep,
                    stop: this.settings.stopSequences,
                    tfs_z: this.settings.tfsZ,
                    typical_p: this.settings.typicalP,
                    repeat_penalty: this.settings.repeatPenalty,
                    repeat_last_n: this.settings.repeatLastN,
                    penalize_nl: this.settings.penalizeNl,
                    presence_penalty: this.settings.presencePenalty,
                    frequency_penalty: this.settings.frequencyPenalty,
                    penalty_prompt: this.settings.penaltyPrompt,
                    mirostat: this.settings.mirostat,
                    mirostat_tau: this.settings.mirostatTau,
                    mirostat_eta: this.settings.mirostatEta,
                    grammar: this.settings.grammar,
                    seed: this.settings.seed,
                    ignore_eos: this.settings.ignoreEos,
                    logit_bias: this.settings.logitBias,
                    n_probs: this.settings.nProbs,
                    cache_prompt: this.settings.cachePrompt,
                    slot_id: this.settings.slotId,
                },
                failedResponseHandler: failedLlamaCppCallResponseHandler,
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
            "topK",
            "topP",
            "minP",
            "nKeep",
            "tfsZ",
            "typicalP",
            "repeatPenalty",
            "repeatLastN",
            "penalizeNl",
            "presencePenalty",
            "frequencyPenalty",
            "penaltyPrompt",
            "mirostat",
            "mirostatTau",
            "mirostatEta",
            "grammar",
            "seed",
            "ignoreEos",
            "logitBias",
            "nProbs",
            "cachePrompt",
            "slotId",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async countPromptTokens(prompt) {
        const tokens = await this.tokenizer.tokenize(prompt.text);
        return tokens.length;
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options, {
            responseFormat: LlamaCppCompletionResponseFormat.json,
        }));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(llamaCppTextGenerationResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: [
                {
                    text: rawResponse.content,
                    finishReason: rawResponse.stopped_eos || rawResponse.stopped_word
                        ? "stop"
                        : rawResponse.stopped_limit
                            ? "length"
                            : "unknown",
                },
            ],
            usage: {
                promptTokens: rawResponse.tokens_evaluated,
                completionTokens: rawResponse.tokens_predicted,
                totalTokens: rawResponse.tokens_evaluated + rawResponse.tokens_predicted,
            },
        };
    }
    doStreamText(prompt, options) {
        return this.callAPI(prompt, options, {
            responseFormat: LlamaCppCompletionResponseFormat.deltaIterable,
        });
    }
    extractTextDelta(delta) {
        return delta.content;
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
    withJsonOutput(schema) {
        // don't override the grammar if it's already set (to allow user to override)
        if (this.settings.grammar != null) {
            return this;
        }
        const grammar = convertJsonSchemaToGBNF(schema.getJsonSchema());
        return this.withSettings({
            grammar: grammar,
        });
    }
    get promptTemplateProvider() {
        return this.settings.promptTemplate ?? Text;
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
    /**
     * Maps the prompt for the full Llama.cpp prompt template (incl. image support).
     */
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
        return new LlamaCppCompletionModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const llamaCppTextGenerationResponseSchema = z.object({
    content: z.string(),
    stop: z.literal(true),
    generation_settings: z.object({
        frequency_penalty: z.number(),
        ignore_eos: z.boolean(),
        logit_bias: z.array(z.number()),
        mirostat: z.number(),
        mirostat_eta: z.number(),
        mirostat_tau: z.number(),
        model: z.string(),
        n_ctx: z.number(),
        n_keep: z.number(),
        n_predict: z.number(),
        n_probs: z.number(),
        penalize_nl: z.boolean(),
        presence_penalty: z.number(),
        repeat_last_n: z.number(),
        repeat_penalty: z.number(),
        seed: z.number(),
        stop: z.array(z.string()),
        stream: z.boolean(),
        temperature: z.number().optional(), // optional for backwards compatibility
        tfs_z: z.number(),
        top_k: z.number(),
        top_p: z.number(),
        typical_p: z.number(),
    }),
    model: z.string(),
    prompt: z.string(),
    stopped_eos: z.boolean(),
    stopped_limit: z.boolean(),
    stopped_word: z.boolean(),
    stopping_word: z.string(),
    timings: z.object({
        predicted_ms: z.number(),
        predicted_n: z.number(),
        predicted_per_second: z.number().nullable(),
        predicted_per_token_ms: z.number().nullable(),
        prompt_ms: z.number().nullable().optional(),
        prompt_n: z.number(),
        prompt_per_second: z.number().nullable(),
        prompt_per_token_ms: z.number().nullable(),
    }),
    tokens_cached: z.number(),
    tokens_evaluated: z.number(),
    tokens_predicted: z.number(),
    truncated: z.boolean(),
});
const llamaCppTextStreamChunkSchema = z.discriminatedUnion("stop", [
    z.object({
        content: z.string(),
        stop: z.literal(false),
    }),
    llamaCppTextGenerationResponseSchema,
]);
async function createLlamaCppFullDeltaIterableQueue(stream) {
    const queue = new AsyncQueue();
    // process the stream asynchonously (no 'await' on purpose):
    parseEventSourceStream({ stream })
        .then(async (events) => {
        try {
            for await (const event of events) {
                const data = event.data;
                const eventData = parseJSON({
                    text: data,
                    schema: zodSchema(llamaCppTextStreamChunkSchema),
                });
                queue.push({ type: "delta", deltaValue: eventData });
                if (eventData.stop) {
                    queue.close();
                }
            }
        }
        catch (error) {
            queue.push({ type: "error", error });
            queue.close();
        }
    })
        .catch((error) => {
        queue.push({ type: "error", error });
        queue.close();
    });
    return queue;
}
export const LlamaCppCompletionResponseFormat = {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false,
        handler: createJsonResponseHandler(zodSchema(llamaCppTextGenerationResponseSchema)),
    },
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: true,
        handler: async ({ response }) => createLlamaCppFullDeltaIterableQueue(response.body),
    },
};
