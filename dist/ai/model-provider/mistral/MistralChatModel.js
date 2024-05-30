import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { createEventSourceResponseHandler } from "../../util/streaming/createEventSourceResponseHandler.js";
import { MistralApiConfiguration } from "./MistralApiConfiguration.js";
import { chat, instruction, text } from "./MistralChatPromptTemplate.js";
import { failedMistralCallResponseHandler } from "./MistralError.js";
export class MistralChatModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "mistral"
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
    async callAPI(prompt, callOptions, options) {
        const api = this.settings.api ?? new MistralApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        const stream = options.responseFormat.stream;
        const successfulResponseHandler = options.responseFormat.handler;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/chat/completions`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    stream,
                    messages: prompt,
                    model: this.settings.model,
                    temperature: this.settings.temperature,
                    top_p: this.settings.topP,
                    max_tokens: this.settings.maxGenerationTokens,
                    safe_mode: this.settings.safeMode,
                    random_seed: this.settings.randomSeed,
                },
                failedResponseHandler: failedMistralCallResponseHandler,
                successfulResponseHandler,
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            ...textGenerationModelProperties,
            "temperature",
            "topP",
            "safeMode",
            "randomSeed",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options, {
            responseFormat: MistralChatResponseFormat.json,
        }));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(mistralChatResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: rawResponse.choices.map((choice) => ({
                text: choice.message.content,
                finishReason: this.translateFinishReason(choice.finish_reason),
            })),
        };
    }
    translateFinishReason(finishReason) {
        switch (finishReason) {
            case "stop":
                return "stop";
            case "length":
            case "model_length":
                return "length";
            default:
                return "unknown";
        }
    }
    doStreamText(prompt, options) {
        return this.callAPI(prompt, options, {
            responseFormat: MistralChatResponseFormat.textDeltaIterable,
        });
    }
    extractTextDelta(delta) {
        const chunk = delta;
        return chunk.choices[0].delta.content ?? undefined;
    }
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt() {
        return this.withPromptTemplate(text());
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
    withChatPrompt() {
        return this.withPromptTemplate(chat());
    }
    withJsonOutput() {
        return this;
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateTextStreamingModel({
            model: this, // stop tokens are not supported by this model
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new MistralChatModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const mistralChatResponseSchema = z.object({
    id: z.string(),
    object: z.string(),
    created: z.number(),
    model: z.string(),
    choices: z.array(z.object({
        index: z.number(),
        message: z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
        }),
        finish_reason: z.enum(["stop", "length", "model_length"]),
    })),
    usage: z.object({
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),
    }),
});
const mistralChatStreamChunkSchema = z.object({
    id: z.string(),
    object: z.string().optional(),
    created: z.number().optional(),
    model: z.string(),
    choices: z.array(z.object({
        index: z.number(),
        delta: z.object({
            role: z.enum(["assistant", "user"]).optional().nullable(),
            content: z.string().nullable().optional(),
        }),
        finish_reason: z
            .enum(["stop", "length", "model_length"])
            .nullable()
            .optional(),
    })),
});
export const MistralChatResponseFormat = {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false,
        handler: createJsonResponseHandler(zodSchema(mistralChatResponseSchema)),
    },
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    textDeltaIterable: {
        stream: true,
        handler: createEventSourceResponseHandler(zodSchema(mistralChatStreamChunkSchema)),
    },
};
