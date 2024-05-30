import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { FlexibleStructureFromTextPromptTemplate, StructureFromTextPromptTemplate } from "../../model-function/generate-structure/StructureFromTextPromptTemplate.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { TextGenerationToolCallModel, ToolCallPromptTemplate } from "../../tool/generate-tool-call/TextGenerationToolCallModel.js";
import { TextGenerationToolCallsModel } from "../../tool/generate-tool-calls/TextGenerationToolCallsModel.js";
import { ToolCallsPromptTemplate } from "../../tool/generate-tool-calls/ToolCallsPromptTemplate.js";
import { OllamaTextGenerationSettings } from "./OllamaTextGenerationSettings.js";
export type OllamaChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
    /**
     Images. Supports base64-encoded `png` and `jpeg` images up to 100MB in size.
     */
    images?: Array<string>;
};
export type OllamaChatPrompt = Array<OllamaChatMessage>;
export interface OllamaChatModelSettings extends OllamaTextGenerationSettings {
    api?: ApiConfiguration;
}
/**
 * Text generation model that uses the Ollama chat API.
 */
export declare class OllamaChatModel extends AbstractModel<OllamaChatModelSettings> implements TextStreamingModel<OllamaChatPrompt, OllamaChatModelSettings> {
    constructor(settings: OllamaChatModelSettings);
    readonly provider = "ollama";
    get modelName(): string;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    readonly contextWindowSize: undefined;
    callAPI<RESPONSE>(prompt: OllamaChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: OllamaChatResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<OllamaChatModelSettings>;
    doGenerateTexts(prompt: OllamaChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    private processTextGenerationResponse;
    doStreamText(prompt: OllamaChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        model: string;
        message: {
            role: string;
            content: string;
        };
        done: false;
        created_at: string;
    } | {
        model: string;
        done: true;
        created_at: string;
        total_duration: number;
        prompt_eval_count: number;
        eval_count: number;
        eval_duration: number;
        load_duration?: number | undefined;
        prompt_eval_duration?: number | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): TextGenerationToolCallModel<INPUT_PROMPT, OllamaChatPrompt, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): TextGenerationToolCallsModel<INPUT_PROMPT, OllamaChatPrompt, this>;
    asStructureGenerationModel<INPUT_PROMPT, OllamaChatPrompt>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, OllamaChatPrompt> | FlexibleStructureFromTextPromptTemplate<INPUT_PROMPT, unknown>): StructureFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>> | StructureFromTextStreamingModel<INPUT_PROMPT, OllamaChatPrompt, TextStreamingModel<OllamaChatPrompt, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>>;
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): PromptTemplateTextStreamingModel<string, OllamaChatPrompt, OllamaChatModelSettings, this>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").InstructionPrompt, OllamaChatPrompt, OllamaChatModelSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").ChatPrompt, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OllamaChatModelSettings>): this;
}
declare const ollamaChatResponseSchema: z.ZodObject<{
    model: z.ZodString;
    created_at: z.ZodString;
    done: z.ZodLiteral<true>;
    message: z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}>;
export type OllamaChatResponse = z.infer<typeof ollamaChatResponseSchema>;
declare const ollamaChatStreamChunkSchema: z.ZodDiscriminatedUnion<"done", [z.ZodObject<{
    done: z.ZodLiteral<false>;
    model: z.ZodString;
    created_at: z.ZodString;
    message: z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>;
}, "strip", z.ZodTypeAny, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: false;
    created_at: string;
}, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: false;
    created_at: string;
}>, z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodNumber;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    prompt_eval_count: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_duration?: number | undefined;
}, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    prompt_eval_count: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_duration?: number | undefined;
}>]>;
export type OllamaChatStreamChunk = z.infer<typeof ollamaChatStreamChunkSchema>;
export type OllamaChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const OllamaChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false;
        handler: ({ response, url, requestBodyValues }: {
            url: string;
            requestBodyValues: unknown;
            response: Response;
        }) => Promise<{
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
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
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: false;
            created_at: string;
        } | {
            model: string;
            done: true;
            created_at: string;
            total_duration: number;
            prompt_eval_count: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_duration?: number | undefined;
        }>>>;
    };
};
export {};
