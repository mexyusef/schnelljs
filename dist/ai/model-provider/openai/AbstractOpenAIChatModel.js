import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { parseJSON } from "../../core/schema/parseJSON.js";
import { validateTypes } from "../../core/schema/validateTypes.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { createEventSourceResponseHandler } from "../../util/streaming/createEventSourceResponseHandler.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { failedOpenAICallResponseHandler } from "./OpenAIError.js";
/**
 * Abstract text generation model that calls an API that is compatible with the OpenAI chat API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export class AbstractOpenAIChatModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
    }
    async callAPI(messages, callOptions, options) {
        const api = this.settings.api ?? new OpenAIApiConfiguration();
        const responseFormat = options.responseFormat;
        const abortSignal = callOptions.run?.abortSignal;
        const user = this.settings.isUserIdForwardingEnabled
            ? callOptions.run?.userId
            : undefined;
        const openAIResponseFormat = this.settings.responseFormat;
        // function & tool calling:
        const functions = options.functions ?? this.settings.functions;
        const functionCall = options.functionCall ?? this.settings.functionCall;
        const tools = options.tools ?? this.settings.tools;
        const toolChoice = options.toolChoice ?? this.settings.toolChoice;
        let { stopSequences } = this.settings;
        return callWithRetryAndThrottle({
            retry: this.settings.api?.retry,
            throttle: this.settings.api?.throttle,
            call: async () => {
                // empty arrays are not allowed for stopSequences:
                if (stopSequences != null &&
                    Array.isArray(stopSequences) &&
                    stopSequences.length === 0) {
                    stopSequences = undefined;
                }
                return postJsonToApi({
                    url: api.assembleUrl("/chat/completions"),
                    headers: api.headers({
                        functionType: callOptions.functionType,
                        functionId: callOptions.functionId,
                        run: callOptions.run,
                        callId: callOptions.callId,
                    }),
                    body: {
                        stream: responseFormat.stream,
                        model: this.settings.model,
                        messages,
                        functions,
                        function_call: functionCall,
                        tools,
                        tool_choice: toolChoice,
                        temperature: this.settings.temperature,
                        top_p: this.settings.topP,
                        n: this.settings.numberOfGenerations,
                        stop: this.settings.stopSequences,
                        max_tokens: this.settings.maxGenerationTokens,
                        presence_penalty: this.settings.presencePenalty,
                        frequency_penalty: this.settings.frequencyPenalty,
                        logit_bias: this.settings.logitBias,
                        seed: this.settings.seed,
                        response_format: openAIResponseFormat,
                        user,
                    },
                    failedResponseHandler: failedOpenAICallResponseHandler,
                    successfulResponseHandler: responseFormat.handler,
                    abortSignal,
                });
            },
        });
    }
    async doGenerateTexts(prompt, options) {
        return this.processTextGenerationResponse(await this.callAPI(prompt, options, {
            responseFormat: OpenAIChatResponseFormat.json,
        }));
    }
    restoreGeneratedTexts(rawResponse) {
        return this.processTextGenerationResponse(validateTypes({
            structure: rawResponse,
            schema: zodSchema(openAIChatResponseSchema),
        }));
    }
    processTextGenerationResponse(rawResponse) {
        return {
            rawResponse,
            textGenerationResults: rawResponse.choices.map((choice) => ({
                text: choice.message.content ?? "",
                finishReason: this.translateFinishReason(choice.finish_reason),
            })),
            usage: this.extractUsage(rawResponse),
        };
    }
    translateFinishReason(finishReason) {
        switch (finishReason) {
            case "stop":
                return "stop";
            case "length":
                return "length";
            case "content_filter":
                return "content-filter";
            case "function_call":
            case "tool_calls":
                return "tool-calls";
            default:
                return "unknown";
        }
    }
    doStreamText(prompt, options) {
        return this.callAPI(prompt, options, {
            responseFormat: OpenAIChatResponseFormat.deltaIterable,
        });
    }
    extractTextDelta(delta) {
        const chunk = delta;
        if (chunk.object !== "chat.completion.chunk") {
            return undefined;
        }
        const chatChunk = chunk;
        const firstChoice = chatChunk.choices[0];
        if (firstChoice.index > 0) {
            return undefined;
        }
        return firstChoice.delta.content ?? undefined;
    }
    async doGenerateToolCall(tool, prompt, options) {
        const rawResponse = await this.callAPI(prompt, options, {
            responseFormat: OpenAIChatResponseFormat.json,
            toolChoice: {
                type: "function",
                function: { name: tool.name },
            },
            tools: [
                {
                    type: "function",
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: tool.parameters.getJsonSchema(),
                    },
                },
            ],
        });
        const toolCalls = rawResponse.choices[0]?.message.tool_calls;
        return {
            rawResponse,
            toolCall: toolCalls == null || toolCalls.length === 0
                ? null
                : {
                    id: toolCalls[0].id,
                    args: parseJSON({ text: toolCalls[0].function.arguments }),
                },
            usage: this.extractUsage(rawResponse),
        };
    }
    async doGenerateToolCalls(tools, prompt, options) {
        const rawResponse = await this.callAPI(prompt, options, {
            responseFormat: OpenAIChatResponseFormat.json,
            toolChoice: "auto",
            tools: tools.map((tool) => ({
                type: "function",
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters.getJsonSchema(),
                },
            })),
        });
        const message = rawResponse.choices[0]?.message;
        return {
            rawResponse,
            text: message.content ?? null,
            toolCalls: message.tool_calls?.map((toolCall) => ({
                id: toolCall.id,
                name: toolCall.function.name,
                args: parseJSON({ text: toolCall.function.arguments }),
            })) ?? null,
            usage: this.extractUsage(rawResponse),
        };
    }
    extractUsage(response) {
        return {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
        };
    }
}
const openAIChatResponseSchema = z.object({
    id: z.string(),
    choices: z.array(z.object({
        message: z.object({
            role: z.literal("assistant"),
            content: z.string().nullable(),
            function_call: z
                .object({
                name: z.string(),
                arguments: z.string(),
            })
                .optional(),
            tool_calls: z
                .array(z.object({
                id: z.string(),
                type: z.literal("function"),
                function: z.object({
                    name: z.string(),
                    arguments: z.string(),
                }),
            }))
                .optional(),
        }),
        index: z.number().optional(), // optional for OpenAI compatible models
        logprobs: z.nullable(z.any()),
        finish_reason: z
            .enum([
            "stop",
            "length",
            "tool_calls",
            "content_filter",
            "function_call",
        ])
            .optional()
            .nullable(),
    })),
    created: z.number(),
    model: z.string(),
    system_fingerprint: z.string().optional().nullable(),
    object: z.literal("chat.completion"),
    usage: z.object({
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),
    }),
});
const openaiChatChunkSchema = z.object({
    object: z.literal("chat.completion.chunk"),
    id: z.string(),
    choices: z.array(z.object({
        delta: z.object({
            role: z.enum(["assistant", "user"]).optional(),
            content: z.string().nullable().optional(),
            function_call: z
                .object({
                name: z.string().optional(),
                arguments: z.string().optional(),
            })
                .optional(),
            tool_calls: z
                .array(z.object({
                id: z.string(),
                type: z.literal("function"),
                function: z.object({
                    name: z.string(),
                    arguments: z.string(),
                }),
            }))
                .optional(),
        }),
        finish_reason: z
            .enum([
            "stop",
            "length",
            "tool_calls",
            "content_filter",
            "function_call",
        ])
            .nullable()
            .optional(),
        index: z.number(),
    })),
    created: z.number(),
    model: z.string().optional(), // optional for OpenAI compatible models
    system_fingerprint: z.string().optional().nullable(),
});
export const OpenAIChatResponseFormat = {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false,
        handler: createJsonResponseHandler(zodSchema(openAIChatResponseSchema)),
    },
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    deltaIterable: {
        stream: true,
        handler: createEventSourceResponseHandler(zodSchema(openaiChatChunkSchema)),
    },
};
