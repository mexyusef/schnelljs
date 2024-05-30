import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { TextGenerationModelSettings } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationFinishReason } from "../../model-function/generate-text/TextGenerationResult.js";
export interface AbstractOpenAICompletionModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    suffix?: string;
    temperature?: number;
    topP?: number;
    logprobs?: number;
    echo?: boolean;
    presencePenalty?: number;
    frequencyPenalty?: number;
    bestOf?: number;
    logitBias?: Record<number, number>;
    seed?: number | null;
    isUserIdForwardingEnabled?: boolean;
}
/**
 * Abstract completion model that calls an API that is compatible with the OpenAI completions API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 */
export declare abstract class AbstractOpenAICompletionModel<SETTINGS extends AbstractOpenAICompletionModelSettings> extends AbstractModel<SETTINGS> {
    constructor(settings: SETTINGS);
    callAPI<RESULT>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAITextResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        };
        textGenerationResults: {
            finishReason: TextGenerationFinishReason;
            text: string;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        };
        textGenerationResults: {
            finishReason: TextGenerationFinishReason;
            text: string;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    private processTextGenerationResponse;
    private translateFinishReason;
    doStreamText(prompt: string, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        object: "text_completion";
        model: string;
        id: string;
        created: number;
        choices: {
            text: string;
            index: number;
            finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        }[];
        system_fingerprint?: string | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    withJsonOutput(): this;
}
declare const OpenAICompletionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        finish_reason: z.ZodNullable<z.ZodOptional<z.ZodEnum<["stop", "length", "content_filter"]>>>;
        index: z.ZodNumber;
        logprobs: z.ZodNullable<z.ZodAny>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }, {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodString;
    system_fingerprint: z.ZodOptional<z.ZodString>;
    object: z.ZodLiteral<"text_completion">;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        completion_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "text_completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }[];
    system_fingerprint?: string | undefined;
}, {
    object: "text_completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }[];
    system_fingerprint?: string | undefined;
}>;
export type OpenAICompletionResponse = z.infer<typeof OpenAICompletionResponseSchema>;
export type OpenAITextResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const OpenAITextResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<import("../../index.js").Delta<{
            object: "text_completion";
            model: string;
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | undefined;
        }>>>;
    };
};
export {};
