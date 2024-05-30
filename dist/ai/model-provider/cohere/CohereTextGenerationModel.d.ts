import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextGenerationModelSettings, TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { TextGenerationFinishReason } from "../../model-function/generate-text/TextGenerationResult.js";
import { CohereTokenizer } from "./CohereTokenizer.js";
export declare const COHERE_TEXT_GENERATION_MODELS: {
    command: {
        contextWindowSize: number;
    };
    "command-light": {
        contextWindowSize: number;
    };
};
export type CohereTextGenerationModelType = keyof typeof COHERE_TEXT_GENERATION_MODELS;
export interface CohereTextGenerationModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: CohereTextGenerationModelType;
    temperature?: number;
    k?: number;
    p?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    returnLikelihoods?: "GENERATION" | "ALL" | "NONE";
    logitBias?: Record<string, number>;
    truncate?: "NONE" | "START" | "END";
    cohereStopSequences?: string[];
}
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
export declare class CohereTextGenerationModel extends AbstractModel<CohereTextGenerationModelSettings> implements TextStreamingModel<string, CohereTextGenerationModelSettings> {
    constructor(settings: CohereTextGenerationModelSettings);
    readonly provider: "cohere";
    get modelName(): "command" | "command-light";
    readonly contextWindowSize: number;
    readonly tokenizer: CohereTokenizer;
    countPromptTokens(input: string): Promise<number>;
    callAPI<RESPONSE>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: CohereTextGenerationResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<CohereTextGenerationModelSettings>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    processTextGenerationResponse(rawResponse: CohereTextGenerationResponse): {
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    private translateFinishReason;
    doStreamText(prompt: string, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        text: string;
        is_finished: false;
    } | {
        response: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        finish_reason: string;
        is_finished: true;
    }>>>;
    extractTextDelta(delta: unknown): string;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").InstructionPrompt, string, CohereTextGenerationModelSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(options?: {
        user?: string;
        assistant?: string;
    }): PromptTemplateTextStreamingModel<import("../../index.js").ChatPrompt, string, CohereTextGenerationModelSettings, this>;
    withJsonOutput(): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, CohereTextGenerationModelSettings, this>;
    withSettings(additionalSettings: Partial<CohereTextGenerationModelSettings>): this;
}
declare const cohereTextGenerationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    generations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        finish_reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }, {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }>, "many">;
    prompt: z.ZodString;
    meta: z.ZodOptional<z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    id: string;
    generations: {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }[];
    meta?: {
        api_version: {
            version: string;
        };
    } | undefined;
}, {
    prompt: string;
    id: string;
    generations: {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }[];
    meta?: {
        api_version: {
            version: string;
        };
    } | undefined;
}>;
export type CohereTextGenerationResponse = z.infer<typeof cohereTextGenerationResponseSchema>;
declare const cohereTextStreamChunkSchema: z.ZodDiscriminatedUnion<"is_finished", [z.ZodObject<{
    text: z.ZodString;
    is_finished: z.ZodLiteral<false>;
}, "strip", z.ZodTypeAny, {
    text: string;
    is_finished: false;
}, {
    text: string;
    is_finished: false;
}>, z.ZodObject<{
    is_finished: z.ZodLiteral<true>;
    finish_reason: z.ZodString;
    response: z.ZodObject<{
        id: z.ZodString;
        generations: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
            finish_reason: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }, {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }>, "many">;
        prompt: z.ZodString;
        meta: z.ZodOptional<z.ZodObject<{
            api_version: z.ZodObject<{
                version: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                version: string;
            }, {
                version: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            api_version: {
                version: string;
            };
        }, {
            api_version: {
                version: string;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    }, {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    response: {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    };
    finish_reason: string;
    is_finished: true;
}, {
    response: {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    };
    finish_reason: string;
    is_finished: true;
}>]>;
export type CohereTextStreamChunk = z.infer<typeof cohereTextStreamChunkSchema>;
export type CohereTextGenerationResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const CohereTextGenerationResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
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
            text: string;
            is_finished: false;
        } | {
            response: {
                prompt: string;
                id: string;
                generations: {
                    text: string;
                    id: string;
                    finish_reason?: string | undefined;
                }[];
                meta?: {
                    api_version: {
                        version: string;
                    };
                } | undefined;
            };
            finish_reason: string;
            is_finished: true;
        }>>>;
    };
};
export {};
