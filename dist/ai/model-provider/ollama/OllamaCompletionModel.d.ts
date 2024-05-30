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
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { TextGenerationPromptTemplateProvider } from "../../model-function/generate-text/prompt-template/PromptTemplateProvider.js";
import { TextGenerationToolCallModel, ToolCallPromptTemplate } from "../../tool/generate-tool-call/TextGenerationToolCallModel.js";
import { TextGenerationToolCallsModel } from "../../tool/generate-tool-calls/TextGenerationToolCallsModel.js";
import { ToolCallsPromptTemplate } from "../../tool/generate-tool-calls/ToolCallsPromptTemplate.js";
import { OllamaTextGenerationSettings } from "./OllamaTextGenerationSettings.js";
export interface OllamaCompletionPrompt {
    /**
     * Text prompt.
     */
    prompt: string;
    /**
     Images. Supports base64-encoded `png` and `jpeg` images up to 100MB in size.
     */
    images?: Array<string>;
}
/**
 * Text generation model that uses the Ollama completion API.
 *
 * @see https://github.com/jmorganca/ollama/blob/main/docs/api.md#generate-a-completion
 */
export interface OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE extends number | undefined> extends OllamaTextGenerationSettings {
    api?: ApiConfiguration;
    /**
     * Specify the context window size of the model that you have loaded in your
     * Ollama server. (Default: 2048)
     */
    contextWindowSize?: CONTEXT_WINDOW_SIZE;
    /**
     * When set to true, no formatting will be applied to the prompt and no context
     * will be returned.
     */
    raw?: boolean;
    system?: string;
    context?: number[];
    /**
     * Prompt template provider that is used when calling `.withTextPrompt()`, `withInstructionPrompt()` or `withChatPrompt()`.
     */
    promptTemplate?: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
}
export declare class OllamaCompletionModel<CONTEXT_WINDOW_SIZE extends number | undefined> extends AbstractModel<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>> implements TextStreamingModel<OllamaCompletionPrompt, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>> {
    constructor(settings: OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>);
    readonly provider = "ollama";
    get modelName(): string;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get contextWindowSize(): CONTEXT_WINDOW_SIZE;
    callAPI<RESPONSE>(prompt: OllamaCompletionPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: OllamaCompletionResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>>;
    doGenerateTexts(prompt: OllamaCompletionPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    processTextGenerationResponse(rawResponse: OllamaCompletionResponse): {
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    doStreamText(prompt: OllamaCompletionPrompt, options: FunctionCallOptions): Promise<AsyncIterable<import("../../index.js").Delta<{
        model: string;
        done: false;
        response: string;
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
        sample_count?: number | undefined;
        sample_duration?: number | undefined;
        prompt_eval_duration?: number | undefined;
        context?: number[] | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asStructureGenerationModel<INPUT_PROMPT, OllamaCompletionPrompt>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt> | FlexibleStructureFromTextPromptTemplate<INPUT_PROMPT, unknown>): StructureFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>> | StructureFromTextStreamingModel<INPUT_PROMPT, OllamaCompletionPrompt, TextStreamingModel<OllamaCompletionPrompt, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>>;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt>): TextGenerationToolCallModel<INPUT_PROMPT, OllamaCompletionPrompt, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt>): TextGenerationToolCallsModel<INPUT_PROMPT, OllamaCompletionPrompt, this>;
    private get promptTemplateProvider();
    withJsonOutput(): this;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, OllamaCompletionPrompt, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, OllamaCompletionPrompt, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, OllamaCompletionPrompt, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, OllamaCompletionPrompt, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withSettings(additionalSettings: Partial<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>>): this;
}
declare const ollamaCompletionResponseSchema: z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    response: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
    context: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    response: string;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}, {
    model: string;
    done: true;
    response: string;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}>;
export type OllamaCompletionResponse = z.infer<typeof ollamaCompletionResponseSchema>;
declare const ollamaCompletionStreamChunkSchema: z.ZodDiscriminatedUnion<"done", [z.ZodObject<{
    done: z.ZodLiteral<false>;
    model: z.ZodString;
    created_at: z.ZodString;
    response: z.ZodString;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: false;
    response: string;
    created_at: string;
}, {
    model: string;
    done: false;
    response: string;
    created_at: string;
}>, z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    sample_count: z.ZodOptional<z.ZodNumber>;
    sample_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodNumber;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
    context: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    prompt_eval_count: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    sample_count?: number | undefined;
    sample_duration?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    prompt_eval_count: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    sample_count?: number | undefined;
    sample_duration?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}>]>;
export type OllamaCompletionStreamChunk = z.infer<typeof ollamaCompletionStreamChunkSchema>;
export type OllamaCompletionResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const OllamaCompletionResponseFormat: {
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
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
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
            done: false;
            response: string;
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
            sample_count?: number | undefined;
            sample_duration?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        }>>>;
    };
};
export {};
