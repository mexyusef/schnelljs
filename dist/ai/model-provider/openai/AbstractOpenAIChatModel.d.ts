import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { TextGenerationModelSettings } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationFinishReason } from "../../model-function/generate-text/TextGenerationResult.js";
import { ToolDefinition } from "../../tool/ToolDefinition.js";
import { OpenAIChatMessage } from "./OpenAIChatMessage.js";
export interface AbstractOpenAIChatSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    functions?: Array<{
        name: string;
        description?: string;
        parameters: unknown;
    }>;
    functionCall?: "none" | "auto" | {
        name: string;
    };
    tools?: Array<{
        type: "function";
        function: {
            name: string;
            description?: string;
            parameters: unknown;
        };
    }>;
    toolChoice?: "none" | "auto" | {
        type: "function";
        function: {
            name: string;
        };
    };
    /**
     * `temperature`: Controls the randomness and creativity in the model's responses.
     * A lower temperature (close to 0) results in more predictable, conservative text, while a higher temperature (close to 1) produces more varied and creative output.
     * Adjust this to balance between consistency and creativity in the model's replies.
     * Example: temperature: 0.5
     */
    temperature?: number;
    /**
     *  This parameter sets a threshold for token selection based on probability.
     * The model will only consider the most likely tokens that cumulatively exceed this threshold while generating a response.
     * It's a way to control the randomness of the output, balancing between diverse responses and sticking to more likely words.
     * This means a topP of .1 will be far less random than one at .9
     * Example: topP: 0.2
     */
    topP?: number;
    /**
     * Used to set the initial state for the random number generator in the model.
     * Providing a specific seed value ensures consistent outputs for the same inputs across different runs - useful for testing and reproducibility.
     * A `null` value (or not setting it) results in varied, non-repeatable outputs each time.
     * Example: seed: 89 (or) seed: null
     */
    seed?: number | null;
    /**
     * Discourages the model from repeating the same information or context already mentioned in the conversation or prompt.
     * Increasing this value encourages the model to introduce new topics or ideas, rather than reiterating what has been said.
     * This is useful for maintaining a diverse and engaging conversation or for brainstorming sessions where varied ideas are needed.
     * Example: presencePenalty: 1.0 // Strongly discourages repeating the same content.
     */
    presencePenalty?: number;
    /**
     * This parameter reduces the likelihood of the model repeatedly using the same words or phrases in its responses.
     * A higher frequency penalty promotes a wider variety of language and expressions in the output.
     * This is particularly useful in creative writing or content generation tasks where diversity in language is desirable.
     * Example: frequencyPenalty: 0.5 // Moderately discourages repetitive language.
     */
    frequencyPenalty?: number;
    responseFormat?: {
        type?: "text" | "json_object";
    };
    logitBias?: Record<number, number>;
    isUserIdForwardingEnabled?: boolean;
}
export type OpenAIChatPrompt = OpenAIChatMessage[];
/**
 * Abstract text generation model that calls an API that is compatible with the OpenAI chat API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export declare abstract class AbstractOpenAIChatModel<SETTINGS extends AbstractOpenAIChatSettings> extends AbstractModel<SETTINGS> {
    constructor(settings: SETTINGS);
    callAPI<RESULT>(messages: OpenAIChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAIChatResponseFormatType<RESULT>;
        functions?: AbstractOpenAIChatSettings["functions"];
        functionCall?: AbstractOpenAIChatSettings["functionCall"];
        tools?: AbstractOpenAIChatSettings["tools"];
        toolChoice?: AbstractOpenAIChatSettings["toolChoice"];
    }): Promise<RESULT>;
    doGenerateTexts(prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    processTextGenerationResponse(rawResponse: OpenAIChatResponse): {
        rawResponse: {
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    private translateFinishReason;
    doStreamText(prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        object: "chat.completion.chunk";
        id: string;
        created: number;
        choices: {
            delta: {
                role?: "user" | "assistant" | undefined;
                content?: string | null | undefined;
                function_call?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                tool_calls?: {
                    function: {
                        name: string;
                        arguments: string;
                    };
                    type: "function";
                    id: string;
                }[] | undefined;
            };
            index: number;
            finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
        }[];
        model?: string | undefined;
        system_fingerprint?: string | null | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    doGenerateToolCalls(tools: Array<ToolDefinition<string, unknown>>, prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        text: string | null;
        toolCalls: {
            id: string;
            name: string;
            args: unknown;
        }[] | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    extractUsage(response: OpenAIChatResponse): {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
declare const openAIChatResponseSchema: z.ZodObject<{
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        message: z.ZodObject<{
            role: z.ZodLiteral<"assistant">;
            content: z.ZodNullable<z.ZodString>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                arguments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                arguments: string;
            }, {
                name: string;
                arguments: string;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodLiteral<"function">;
                function: z.ZodObject<{
                    name: z.ZodString;
                    arguments: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    arguments: string;
                }, {
                    name: string;
                    arguments: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }, {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }>;
        index: z.ZodOptional<z.ZodNumber>;
        logprobs: z.ZodNullable<z.ZodAny>;
        finish_reason: z.ZodNullable<z.ZodOptional<z.ZodEnum<["stop", "length", "tool_calls", "content_filter", "function_call"]>>>;
    }, "strip", z.ZodTypeAny, {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }, {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodString;
    system_fingerprint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    object: z.ZodLiteral<"chat.completion">;
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
    object: "chat.completion";
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
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    system_fingerprint?: string | null | undefined;
}, {
    object: "chat.completion";
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
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    system_fingerprint?: string | null | undefined;
}>;
export type OpenAIChatResponse = z.infer<typeof openAIChatResponseSchema>;
declare const openaiChatChunkSchema: z.ZodObject<{
    object: z.ZodLiteral<"chat.completion.chunk">;
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        delta: z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["assistant", "user"]>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                arguments: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                arguments?: string | undefined;
            }, {
                name?: string | undefined;
                arguments?: string | undefined;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodLiteral<"function">;
                function: z.ZodObject<{
                    name: z.ZodString;
                    arguments: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    arguments: string;
                }, {
                    name: string;
                    arguments: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }, {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }>;
        finish_reason: z.ZodOptional<z.ZodNullable<z.ZodEnum<["stop", "length", "tool_calls", "content_filter", "function_call"]>>>;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }, {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    system_fingerprint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    object: "chat.completion.chunk";
    id: string;
    created: number;
    choices: {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    model?: string | undefined;
    system_fingerprint?: string | null | undefined;
}, {
    object: "chat.completion.chunk";
    id: string;
    created: number;
    choices: {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    model?: string | undefined;
    system_fingerprint?: string | null | undefined;
}>;
export type OpenAIChatChunk = z.infer<typeof openaiChatChunkSchema>;
export type OpenAIChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const OpenAIChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: "chat.completion";
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
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<import("../../index.js").Delta<{
            object: "chat.completion.chunk";
            id: string;
            created: number;
            choices: {
                delta: {
                    role?: "user" | "assistant" | undefined;
                    content?: string | null | undefined;
                    function_call?: {
                        name?: string | undefined;
                        arguments?: string | undefined;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index: number;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            model?: string | undefined;
            system_fingerprint?: string | null | undefined;
        }>>>;
    };
};
export {};
