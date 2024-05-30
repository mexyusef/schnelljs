/// <reference types="node" />
import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { TranscriptionModel, TranscriptionModelSettings } from "../../model-function/generate-transcription/TranscriptionModel.js";
/**
 * @see https://openai.com/pricing
 */
export declare const OPENAI_TRANSCRIPTION_MODELS: {
    "whisper-1": {
        costInMillicentsPerSecond: number;
    };
};
export type OpenAITranscriptionModelType = keyof typeof OPENAI_TRANSCRIPTION_MODELS;
export declare const calculateOpenAITranscriptionCostInMillicents: ({ model, response, }: {
    model: OpenAITranscriptionModelType;
    response: OpenAITranscriptionVerboseJsonResponse;
}) => number | null;
export interface OpenAITranscriptionModelSettings extends TranscriptionModelSettings {
    api?: ApiConfiguration;
    /**
     * ID of the model to use. Only whisper-1 is currently available.
     */
    model: OpenAITranscriptionModelType;
    /**
     * The language of the input audio. Supplying the input language in ISO-639-1 format will improve accuracy and latency.
     */
    language?: string;
    /**
     * The sampling temperature, between 0 and 1.
     * Higher values like 0.8 will make the output more random,
     * while lower values like 0.2 will make it more focused and deterministic.
     * If set to 0, the model will use log probability to automatically
     * increase the temperature until certain thresholds are hit.
     */
    temperature?: number;
    /**
     * An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.
     */
    prompt?: string;
}
export type OpenAITranscriptionInput = {
    type: "flac" | "m4a" | "mp3" | "mp4" | "mpeg" | "mpga" | "ogg" | "wav" | "webm";
    data: Buffer;
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
export declare class OpenAITranscriptionModel extends AbstractModel<OpenAITranscriptionModelSettings> implements TranscriptionModel<OpenAITranscriptionInput, OpenAITranscriptionModelSettings> {
    constructor(settings: OpenAITranscriptionModelSettings);
    readonly provider: "openai";
    get modelName(): "whisper-1";
    doTranscribe(data: OpenAITranscriptionInput, options: FunctionCallOptions): Promise<{
        rawResponse: {
            text: string;
            duration: number;
            task: "transcribe";
            language: string;
            segments: {
                text: string;
                id: number;
                temperature: number;
                tokens: number[];
                start: number;
                seek: number;
                end: number;
                avg_logprob: number;
                compression_ratio: number;
                no_speech_prob: number;
                transient?: boolean | undefined;
            }[];
        };
        transcription: string;
    }>;
    callAPI<RESULT>(data: OpenAITranscriptionInput, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAITranscriptionResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<OpenAITranscriptionModelSettings>;
    withSettings(additionalSettings: OpenAITranscriptionModelSettings): this;
}
declare const openAITranscriptionJsonSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export type OpenAITranscriptionJsonResponse = z.infer<typeof openAITranscriptionJsonSchema>;
declare const openAITranscriptionVerboseJsonSchema: z.ZodObject<{
    task: z.ZodLiteral<"transcribe">;
    language: z.ZodString;
    duration: z.ZodNumber;
    segments: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        seek: z.ZodNumber;
        start: z.ZodNumber;
        end: z.ZodNumber;
        text: z.ZodString;
        tokens: z.ZodArray<z.ZodNumber, "many">;
        temperature: z.ZodNumber;
        avg_logprob: z.ZodNumber;
        compression_ratio: z.ZodNumber;
        no_speech_prob: z.ZodNumber;
        transient: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }, {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }>, "many">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    duration: number;
    task: "transcribe";
    language: string;
    segments: {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }[];
}, {
    text: string;
    duration: number;
    task: "transcribe";
    language: string;
    segments: {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }[];
}>;
export type OpenAITranscriptionVerboseJsonResponse = z.infer<typeof openAITranscriptionVerboseJsonSchema>;
export type OpenAITranscriptionResponseFormatType<T> = {
    type: "json" | "text" | "srt" | "verbose_json" | "vtt";
    handler: ResponseHandler<T>;
};
export declare const OpenAITranscriptionResponseFormat: {
    json: {
        type: "json";
        handler: ResponseHandler<{
            text: string;
        }>;
    };
    verboseJson: {
        type: "verbose_json";
        handler: ResponseHandler<{
            text: string;
            duration: number;
            task: "transcribe";
            language: string;
            segments: {
                text: string;
                id: number;
                temperature: number;
                tokens: number[];
                start: number;
                seek: number;
                end: number;
                avg_logprob: number;
                compression_ratio: number;
                no_speech_prob: number;
                transient?: boolean | undefined;
            }[];
        }>;
    };
    text: {
        type: "text";
        handler: ResponseHandler<string>;
    };
    srt: {
        type: "srt";
        handler: ResponseHandler<string>;
    };
    vtt: {
        type: "vtt";
        handler: ResponseHandler<string>;
    };
};
export {};
