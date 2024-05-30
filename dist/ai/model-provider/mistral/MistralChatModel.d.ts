import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextGenerationModelSettings, TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { TextGenerationFinishReason } from "../../model-function/generate-text/TextGenerationResult.js";
export type MistralChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};
export type MistralChatPrompt = Array<MistralChatMessage>;
export interface MistralChatModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: "mistral-tiny" | "mistral-small" | "mistral-medium";
    /**
     * What sampling temperature to use, between 0.0 and 2.0.
     * Higher values like 0.8 will make the output more random,
     * while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or top_p but not both.
     *
     * Default: 0.7
     */
    temperature?: number | null;
    /**
     * Nucleus sampling, where the model considers the results of the tokens
     * with top_p probability mass. So 0.1 means only the tokens comprising
     * the top 10% probability mass are considered.
     *
     * We generally recommend altering this or temperature but not both.
     *
     * Default: 1
     */
    topP?: number;
    /**
     * Whether to inject a safety prompt before all conversations.
     *
     * Default: false
     */
    safeMode?: boolean;
    /**
     * The seed to use for random sampling. If set, different calls will
     * generate deterministic results.
     */
    randomSeed?: number | null;
}
export declare class MistralChatModel extends AbstractModel<MistralChatModelSettings> implements TextStreamingModel<MistralChatPrompt, MistralChatModelSettings> {
    constructor(settings: MistralChatModelSettings);
    readonly provider = "mistral";
    get modelName(): "mistral-tiny" | "mistral-small" | "mistral-medium";
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    callAPI<RESULT>(prompt: MistralChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: MistralChatResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<MistralChatModelSettings>;
    doGenerateTexts(prompt: MistralChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    processTextGenerationResponse(rawResponse: MistralChatResponse): {
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    private translateFinishReason;
    doStreamText(prompt: MistralChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        model: string;
        id: string;
        choices: {
            delta: {
                role?: "user" | "assistant" | null | undefined;
                content?: string | null | undefined;
            };
            index: number;
            finish_reason?: "length" | "stop" | "model_length" | null | undefined;
        }[];
        object?: string | undefined;
        created?: number | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): PromptTemplateTextStreamingModel<string, MistralChatPrompt, MistralChatModelSettings, this>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").InstructionPrompt, MistralChatPrompt, MistralChatModelSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").ChatPrompt, MistralChatPrompt, MistralChatModelSettings, this>;
    withJsonOutput(): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, MistralChatPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, MistralChatPrompt, MistralChatModelSettings, this>;
    withSettings(additionalSettings: Partial<MistralChatModelSettings>): this;
}
declare const mistralChatResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodString;
    created: z.ZodNumber;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        message: z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            role: "user" | "assistant";
            content: string;
        }, {
            role: "user" | "assistant";
            content: string;
        }>;
        finish_reason: z.ZodEnum<["stop", "length", "model_length"]>;
    }, "strip", z.ZodTypeAny, {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }, {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }>, "many">;
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
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }[];
}, {
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }[];
}>;
export type MistralChatResponse = z.infer<typeof mistralChatResponseSchema>;
declare const mistralChatStreamChunkSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodNumber>;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        delta: z.ZodObject<{
            role: z.ZodNullable<z.ZodOptional<z.ZodEnum<["assistant", "user"]>>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        }, {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        }>;
        finish_reason: z.ZodOptional<z.ZodNullable<z.ZodEnum<["stop", "length", "model_length"]>>>;
    }, "strip", z.ZodTypeAny, {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }, {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    model: string;
    id: string;
    choices: {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }[];
    object?: string | undefined;
    created?: number | undefined;
}, {
    model: string;
    id: string;
    choices: {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }[];
    object?: string | undefined;
    created?: number | undefined;
}>;
export type MistralChatStreamChunk = z.infer<typeof mistralChatStreamChunkSchema>;
export type MistralChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const MistralChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        }>;
    };
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    textDeltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<import("../../index.js").Delta<{
            model: string;
            id: string;
            choices: {
                delta: {
                    role?: "user" | "assistant" | null | undefined;
                    content?: string | null | undefined;
                };
                index: number;
                finish_reason?: "length" | "stop" | "model_length" | null | undefined;
            }[];
            object?: string | undefined;
            created?: number | undefined;
        }>>>;
    };
};
export {};
