import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { StructureStreamingModel } from "../../model-function/generate-structure/StructureGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { OpenAIChatPrompt } from "./AbstractOpenAIChatModel.js";
import { OpenAIChatModel, OpenAIChatSettings } from "./OpenAIChatModel.js";
export declare class OpenAIChatFunctionCallStructureGenerationModel<PROMPT_TEMPLATE extends TextGenerationPromptTemplate<unknown, OpenAIChatPrompt>> implements StructureStreamingModel<Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
OpenAIChatSettings> {
    readonly model: OpenAIChatModel;
    readonly fnName: string;
    readonly fnDescription?: string;
    readonly promptTemplate: PROMPT_TEMPLATE;
    constructor({ model, fnName, fnDescription, promptTemplate, }: {
        model: OpenAIChatModel;
        fnName: string;
        fnDescription?: string;
        promptTemplate: PROMPT_TEMPLATE;
    });
    get modelInformation(): import("../../index.js").ModelInformation;
    get settings(): {
        fnName: string;
        fnDescription: string | undefined;
        model: import("./OpenAIChatModel.js").OpenAIChatModelType;
        api?: import("../../index.js").ApiConfiguration | undefined;
        functions?: {
            name: string;
            description?: string | undefined;
            parameters: unknown;
        }[] | undefined;
        functionCall?: "auto" | {
            name: string;
        } | "none" | undefined;
        tools?: {
            type: "function";
            function: {
                name: string;
                description?: string | undefined;
                parameters: unknown;
            };
        }[] | undefined;
        toolChoice?: "auto" | "none" | {
            type: "function";
            function: {
                name: string;
            };
        } | undefined;
        temperature?: number | undefined;
        topP?: number | undefined;
        seed?: number | null | undefined;
        presencePenalty?: number | undefined;
        frequencyPenalty?: number | undefined;
        responseFormat?: {
            type?: "text" | "json_object" | undefined;
        } | undefined;
        logitBias?: Record<number, number> | undefined;
        isUserIdForwardingEnabled?: boolean | undefined;
        maxGenerationTokens?: number | undefined;
        stopSequences?: string[] | undefined;
        numberOfGenerations?: number | undefined;
        trimWhitespace?: boolean | undefined;
        observers?: import("../../index.js").FunctionObserver[] | undefined;
    };
    get settingsForEvent(): {
        fnName: string;
        fnDescription: string | undefined;
        model?: import("./OpenAIChatModel.js").OpenAIChatModelType | undefined;
        api?: import("../../index.js").ApiConfiguration | undefined;
        functions?: {
            name: string;
            description?: string | undefined;
            parameters: unknown;
        }[] | undefined;
        functionCall?: "auto" | {
            name: string;
        } | "none" | undefined;
        tools?: {
            type: "function";
            function: {
                name: string;
                description?: string | undefined;
                parameters: unknown;
            };
        }[] | undefined;
        toolChoice?: "auto" | "none" | {
            type: "function";
            function: {
                name: string;
            };
        } | undefined;
        temperature?: number | undefined;
        topP?: number | undefined;
        seed?: number | null | undefined;
        presencePenalty?: number | undefined;
        frequencyPenalty?: number | undefined;
        responseFormat?: {
            type?: "text" | "json_object" | undefined;
        } | undefined;
        logitBias?: Record<number, number> | undefined;
        isUserIdForwardingEnabled?: boolean | undefined;
        maxGenerationTokens?: number | undefined;
        stopSequences?: string[] | undefined;
        numberOfGenerations?: number | undefined;
        trimWhitespace?: boolean | undefined;
        observers?: import("../../index.js").FunctionObserver[] | undefined;
    };
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): OpenAIChatFunctionCallStructureGenerationModel<TextGenerationPromptTemplate<string, OpenAIChatPrompt>>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): OpenAIChatFunctionCallStructureGenerationModel<TextGenerationPromptTemplate<import("../../index.js").InstructionPrompt, OpenAIChatPrompt>>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): OpenAIChatFunctionCallStructureGenerationModel<TextGenerationPromptTemplate<import("../../index.js").ChatPrompt, OpenAIChatPrompt>>;
    withPromptTemplate<TARGET_PROMPT_FORMAT extends TextGenerationPromptTemplate<unknown, OpenAIChatPrompt>>(promptTemplate: TARGET_PROMPT_FORMAT): OpenAIChatFunctionCallStructureGenerationModel<TARGET_PROMPT_FORMAT>;
    withSettings(additionalSettings: Partial<OpenAIChatSettings>): this;
    /**
     * JSON generation uses the OpenAI GPT function calling API.
     * It provides a single function specification and instructs the model to provide parameters for calling the function.
     * The result is returned as parsed JSON.
     *
     * @see https://platform.openai.com/docs/guides/gpt/function-calling
     */
    doGenerateStructure(schema: Schema<unknown> & JsonSchemaProducer, prompt: Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
    options: FunctionCallOptions): Promise<{
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
        valueText: string;
        value: any;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    doStreamStructure(schema: Schema<unknown> & JsonSchemaProducer, prompt: Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
    options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
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
    extractStructureTextDelta(delta: unknown): string | undefined;
    parseAccumulatedStructureText(accumulatedText: string): unknown;
}
