import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { Delta } from "../../model-function/Delta.js";
import { FlexibleStructureFromTextPromptTemplate, StructureFromTextPromptTemplate } from "../../model-function/generate-structure/StructureFromTextPromptTemplate.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextGenerationModelSettings, TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { TextGenerationPromptTemplateProvider } from "../../model-function/generate-text/prompt-template/PromptTemplateProvider.js";
import { LlamaCppTokenizer } from "./LlamaCppTokenizer.js";
export interface LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE extends number | undefined> extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * Specify the context window size of the model that you have loaded in your
     * Llama.cpp server.
     */
    contextWindowSize?: CONTEXT_WINDOW_SIZE;
    /**
     * Adjust the randomness of the generated text (default: 0.8).
     */
    temperature?: number;
    /**
     * Limit the next token selection to the K most probable tokens (default: 40).
     */
    topK?: number;
    /**
     * Limit the next token selection to a subset of tokens with a cumulative probability above a threshold P (default: 0.95).
     */
    topP?: number;
    /**
     * The minimum probability for a token to be considered, relative to the probability of the most likely token (default: 0.05).
     */
    minP?: number;
    /**
     * Specify the number of tokens from the prompt to retain when the context size is exceeded
     * and tokens need to be discarded. By default, this value is set to 0 (meaning no tokens
     * are kept). Use -1 to retain all tokens from the prompt.
     */
    nKeep?: number;
    /**
     * Enable tail free sampling with parameter z (default: 1.0, 1.0 = disabled).
     */
    tfsZ?: number;
    /**
     * Enable locally typical sampling with parameter p (default: 1.0, 1.0 = disabled).
     */
    typicalP?: number;
    /**
     * Control the repetition of token sequences in the generated text (default: 1.1).
     */
    repeatPenalty?: number;
    /**
     * Last n tokens to consider for penalizing repetition (default: 64, 0 = disabled, -1 = ctx-size).
     */
    repeatLastN?: number;
    /**
     * Penalize newline tokens when applying the repeat penalty (default: true).
     */
    penalizeNl?: boolean;
    /**
     * Repeat alpha presence penalty (default: 0.0, 0.0 = disabled).
     */
    presencePenalty?: number;
    /**
     * Repeat alpha frequency penalty (default: 0.0, 0.0 = disabled).
     */
    frequencyPenalty?: number;
    /**
     * This will replace the prompt for the purpose of the penalty evaluation.
     * Can be either null, a string or an array of numbers representing tokens
     * (default: null = use the original prompt).
     */
    penaltyPrompt?: string | number[];
    /**
     * Enable Mirostat sampling, controlling perplexity during text generation
     * (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0).
     */
    mirostat?: number;
    /**
     * Set the Mirostat target entropy, parameter tau (default: 5.0).
     */
    mirostatTau?: number;
    /**
     * Set the Mirostat learning rate, parameter eta (default: 0.1).
     */
    mirostatEta?: number;
    /**
     * Set grammar for grammar-based sampling (default: no grammar)
     *
     * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/README.md
     */
    grammar?: string;
    /**
     * Set the random number generator (RNG) seed
     * (default: -1, -1 = random seed).
     */
    seed?: number;
    /**
     * Ignore end of stream token and continue generating (default: false).
     */
    ignoreEos?: boolean;
    /**
     * Modify the likelihood of a token appearing in the generated text completion.
     * For example, use "logit_bias": [[15043,1.0]] to increase the likelihood of the token
     * 'Hello', or "logit_bias": [[15043,-1.0]] to decrease its likelihood.
     * Setting the value to false, "logit_bias": [[15043,false]] ensures that the token Hello is
     * never produced (default: []).
     */
    logitBias?: Array<[number, number | false]>;
    /**
     * If greater than 0, the response also contains the probabilities of top N tokens
     * for each generated token (default: 0)
     */
    nProbs?: number;
    /**
     * Save the prompt and generation for avoid reprocess entire prompt if a part of this isn't change (default: false)
     */
    cachePrompt?: boolean;
    /**
     * Assign the completion task to an specific slot.
     * If is -1 the task will be assigned to a Idle slot (default: -1)
     */
    slotId?: number;
    /**
     * Prompt template provider that is used when calling `.withTextPrompt()`, `withInstructionPrompt()` or `withChatPrompt()`.
     */
    promptTemplate?: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
}
export interface LlamaCppCompletionPrompt {
    /**
     * Text prompt. Images can be included through references such as `[img-ID]`, e.g. `[img-1]`.
     */
    text: string;
    /**
     * Maps image id to image base data.
     */
    images?: Record<number, string>;
}
export declare class LlamaCppCompletionModel<CONTEXT_WINDOW_SIZE extends number | undefined> extends AbstractModel<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>> implements TextStreamingModel<LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>> {
    constructor(settings?: LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>);
    readonly provider = "llamacpp";
    get modelName(): null;
    get contextWindowSize(): CONTEXT_WINDOW_SIZE;
    readonly tokenizer: LlamaCppTokenizer;
    callAPI<RESPONSE>(prompt: LlamaCppCompletionPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: LlamaCppCompletionResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>>;
    countPromptTokens(prompt: LlamaCppCompletionPrompt): Promise<number>;
    doGenerateTexts(prompt: LlamaCppCompletionPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    processTextGenerationResponse(rawResponse: LlamaCppTextGenerationResponse): {
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    doStreamText(prompt: LlamaCppCompletionPrompt, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        model: string;
        prompt: string;
        stop: true;
        content: string;
        generation_settings: {
            model: string;
            stream: boolean;
            stop: string[];
            seed: number;
            mirostat: number;
            frequency_penalty: number;
            ignore_eos: boolean;
            logit_bias: number[];
            mirostat_eta: number;
            mirostat_tau: number;
            n_ctx: number;
            n_keep: number;
            n_predict: number;
            n_probs: number;
            penalize_nl: boolean;
            presence_penalty: number;
            repeat_last_n: number;
            repeat_penalty: number;
            tfs_z: number;
            top_k: number;
            top_p: number;
            typical_p: number;
            temperature?: number | undefined;
        };
        stopped_eos: boolean;
        stopped_limit: boolean;
        stopped_word: boolean;
        stopping_word: string;
        timings: {
            predicted_ms: number;
            predicted_n: number;
            predicted_per_second: number | null;
            predicted_per_token_ms: number | null;
            prompt_n: number;
            prompt_per_second: number | null;
            prompt_per_token_ms: number | null;
            prompt_ms?: number | null | undefined;
        };
        tokens_cached: number;
        tokens_evaluated: number;
        tokens_predicted: number;
        truncated: boolean;
    } | {
        stop: false;
        content: string;
    }>>>;
    extractTextDelta(delta: unknown): string;
    asStructureGenerationModel<INPUT_PROMPT, LlamaCppPrompt>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, LlamaCppPrompt> | FlexibleStructureFromTextPromptTemplate<INPUT_PROMPT, unknown>): StructureFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | StructureFromTextStreamingModel<INPUT_PROMPT, LlamaCppPrompt, TextStreamingModel<LlamaCppPrompt, TextGenerationModelSettings>>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    private get promptTemplateProvider();
    withTextPrompt(): PromptTemplateTextStreamingModel<string, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    /**
     * Maps the prompt for the full Llama.cpp prompt template (incl. image support).
     */
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, LlamaCppCompletionPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withSettings(additionalSettings: Partial<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>>): this;
}
declare const llamaCppTextGenerationResponseSchema: z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<true>;
    generation_settings: z.ZodObject<{
        frequency_penalty: z.ZodNumber;
        ignore_eos: z.ZodBoolean;
        logit_bias: z.ZodArray<z.ZodNumber, "many">;
        mirostat: z.ZodNumber;
        mirostat_eta: z.ZodNumber;
        mirostat_tau: z.ZodNumber;
        model: z.ZodString;
        n_ctx: z.ZodNumber;
        n_keep: z.ZodNumber;
        n_predict: z.ZodNumber;
        n_probs: z.ZodNumber;
        penalize_nl: z.ZodBoolean;
        presence_penalty: z.ZodNumber;
        repeat_last_n: z.ZodNumber;
        repeat_penalty: z.ZodNumber;
        seed: z.ZodNumber;
        stop: z.ZodArray<z.ZodString, "many">;
        stream: z.ZodBoolean;
        temperature: z.ZodOptional<z.ZodNumber>;
        tfs_z: z.ZodNumber;
        top_k: z.ZodNumber;
        top_p: z.ZodNumber;
        typical_p: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }>;
    model: z.ZodString;
    prompt: z.ZodString;
    stopped_eos: z.ZodBoolean;
    stopped_limit: z.ZodBoolean;
    stopped_word: z.ZodBoolean;
    stopping_word: z.ZodString;
    timings: z.ZodObject<{
        predicted_ms: z.ZodNumber;
        predicted_n: z.ZodNumber;
        predicted_per_second: z.ZodNullable<z.ZodNumber>;
        predicted_per_token_ms: z.ZodNullable<z.ZodNumber>;
        prompt_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        prompt_n: z.ZodNumber;
        prompt_per_second: z.ZodNullable<z.ZodNumber>;
        prompt_per_token_ms: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }>;
    tokens_cached: z.ZodNumber;
    tokens_evaluated: z.ZodNumber;
    tokens_predicted: z.ZodNumber;
    truncated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}>;
export type LlamaCppTextGenerationResponse = z.infer<typeof llamaCppTextGenerationResponseSchema>;
declare const llamaCppTextStreamChunkSchema: z.ZodDiscriminatedUnion<"stop", [z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<false>;
}, "strip", z.ZodTypeAny, {
    stop: false;
    content: string;
}, {
    stop: false;
    content: string;
}>, z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<true>;
    generation_settings: z.ZodObject<{
        frequency_penalty: z.ZodNumber;
        ignore_eos: z.ZodBoolean;
        logit_bias: z.ZodArray<z.ZodNumber, "many">;
        mirostat: z.ZodNumber;
        mirostat_eta: z.ZodNumber;
        mirostat_tau: z.ZodNumber;
        model: z.ZodString;
        n_ctx: z.ZodNumber;
        n_keep: z.ZodNumber;
        n_predict: z.ZodNumber;
        n_probs: z.ZodNumber;
        penalize_nl: z.ZodBoolean;
        presence_penalty: z.ZodNumber;
        repeat_last_n: z.ZodNumber;
        repeat_penalty: z.ZodNumber;
        seed: z.ZodNumber;
        stop: z.ZodArray<z.ZodString, "many">;
        stream: z.ZodBoolean;
        temperature: z.ZodOptional<z.ZodNumber>;
        tfs_z: z.ZodNumber;
        top_k: z.ZodNumber;
        top_p: z.ZodNumber;
        typical_p: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }>;
    model: z.ZodString;
    prompt: z.ZodString;
    stopped_eos: z.ZodBoolean;
    stopped_limit: z.ZodBoolean;
    stopped_word: z.ZodBoolean;
    stopping_word: z.ZodString;
    timings: z.ZodObject<{
        predicted_ms: z.ZodNumber;
        predicted_n: z.ZodNumber;
        predicted_per_second: z.ZodNullable<z.ZodNumber>;
        predicted_per_token_ms: z.ZodNullable<z.ZodNumber>;
        prompt_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        prompt_n: z.ZodNumber;
        prompt_per_second: z.ZodNullable<z.ZodNumber>;
        prompt_per_token_ms: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }>;
    tokens_cached: z.ZodNumber;
    tokens_evaluated: z.ZodNumber;
    tokens_predicted: z.ZodNumber;
    truncated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}>]>;
export type LlamaCppTextStreamChunk = z.infer<typeof llamaCppTextStreamChunkSchema>;
export type LlamaCppCompletionResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
export declare const LlamaCppCompletionResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false;
        handler: ResponseHandler<{
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: true;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        } | {
            stop: false;
            content: string;
        }>>>;
    };
};
export {};
