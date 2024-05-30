import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, createTextResponseHandler, postToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { failedOpenAICallResponseHandler } from "./OpenAIError.js";
/**
 * @see https://openai.com/pricing
 */
export const OPENAI_TRANSCRIPTION_MODELS = {
    "whisper-1": {
        costInMillicentsPerSecond: 10, // = 600 / 60,
    },
};
export const calculateOpenAITranscriptionCostInMillicents = ({ model, response, }) => {
    if (model !== "whisper-1") {
        return null;
    }
    const durationInSeconds = response.duration;
    return (Math.ceil(durationInSeconds) *
        OPENAI_TRANSCRIPTION_MODELS[model].costInMillicentsPerSecond);
};
/**
 * Create a transcription model that calls the OpenAI transcription API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/create
 *
 * @example
 * const data = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await transcribe(
 *   new OpenAITranscriptionModel({ model: "whisper-1" }),
 *   {
 *     type: "mp3",
 *     data,
 *   }
 * );
 */
export class OpenAITranscriptionModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "openai"
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async doTranscribe(data, options) {
        const rawResponse = await this.callAPI(data, options, {
            responseFormat: OpenAITranscriptionResponseFormat.verboseJson,
        });
        return {
            rawResponse,
            transcription: rawResponse.text,
        };
    }
    async callAPI(data, callOptions, options) {
        const api = this.settings.api ?? new OpenAIApiConfiguration();
        const abortSignal = callOptions?.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => {
                const fileName = `audio.${data.type}`;
                const formData = new FormData();
                formData.append("file", new Blob([data.data]), fileName);
                formData.append("model", this.settings.model);
                if (this.settings.prompt != null) {
                    formData.append("prompt", this.settings.prompt);
                }
                if (options.responseFormat != null) {
                    formData.append("response_format", options.responseFormat.type);
                }
                if (this.settings.temperature != null) {
                    formData.append("temperature", this.settings.temperature.toString());
                }
                if (this.settings.language != null) {
                    formData.append("language", this.settings.language);
                }
                return postToApi({
                    url: api.assembleUrl("/audio/transcriptions"),
                    headers: api.headers({
                        functionType: callOptions.functionType,
                        functionId: callOptions.functionId,
                        run: callOptions.run,
                        callId: callOptions.callId,
                    }),
                    body: {
                        content: formData,
                        values: {
                            model: this.settings.model,
                            prompt: this.settings.prompt,
                            response_format: options.responseFormat,
                            temperature: this.settings.temperature,
                            language: this.settings.language,
                        },
                    },
                    failedResponseHandler: failedOpenAICallResponseHandler,
                    successfulResponseHandler: options.responseFormat.handler,
                    abortSignal,
                });
            },
        });
    }
    get settingsForEvent() {
        return {
            language: this.settings.language,
            temperature: this.settings.temperature,
        };
    }
    withSettings(additionalSettings) {
        return new OpenAITranscriptionModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const openAITranscriptionJsonSchema = z.object({
    text: z.string(),
});
const openAITranscriptionVerboseJsonSchema = z.object({
    task: z.literal("transcribe"),
    language: z.string(),
    duration: z.number(),
    segments: z.array(z.object({
        id: z.number(),
        seek: z.number(),
        start: z.number(),
        end: z.number(),
        text: z.string(),
        tokens: z.array(z.number()),
        temperature: z.number(),
        avg_logprob: z.number(),
        compression_ratio: z.number(),
        no_speech_prob: z.number(),
        transient: z.boolean().optional(),
    })),
    text: z.string(),
});
export const OpenAITranscriptionResponseFormat = {
    json: {
        type: "json",
        handler: createJsonResponseHandler(zodSchema(openAITranscriptionJsonSchema)),
    },
    verboseJson: {
        type: "verbose_json",
        handler: createJsonResponseHandler(zodSchema(openAITranscriptionVerboseJsonSchema)),
    },
    text: {
        type: "text",
        handler: createTextResponseHandler(),
    },
    srt: {
        type: "srt",
        handler: createTextResponseHandler(),
    },
    vtt: {
        type: "vtt",
        handler: createTextResponseHandler(),
    },
};
