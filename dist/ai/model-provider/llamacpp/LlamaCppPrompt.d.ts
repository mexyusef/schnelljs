import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { TextGenerationPromptTemplateProvider } from "../../model-function/generate-text/prompt-template/PromptTemplateProvider.js";
import * as LlamaCppBakLLaVA1Prompt from "./LlamaCppBakLLaVA1PromptTemplate.js";
import { LlamaCppCompletionPrompt } from "./LlamaCppCompletionModel.js";
export declare function asLlamaCppPromptTemplate<SOURCE_PROMPT>(promptTemplate: TextGenerationPromptTemplate<SOURCE_PROMPT, string>): TextGenerationPromptTemplate<SOURCE_PROMPT, LlamaCppCompletionPrompt>;
export declare function asLlamaCppTextPromptTemplateProvider(promptTemplateProvider: TextGenerationPromptTemplateProvider<string>): TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const Text: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
/**
 * Formats text, instruction or chat prompts as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Text prompt:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * Instruction prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s>[INST] ${instruction} [/INST] ${ response prefix }
 * ```
 *
 * Instruction prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ instruction } [/INST] ${ response prefix }
 * ```
 *
 * Chat prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s> [INST] ${ user msg 1 } [/INST] ${ model response 1 } [INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * Chat prompt when there is no system prompt:
 * ```
 * <s>[INST] ${ user msg 1 } [/INST] ${ model response 1 } </s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
export declare const Mistral: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const ChatML: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const Llama2: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const NeuralChat: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const Alpaca: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const Synthia: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const Vicuna: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
export declare const BakLLaVA1: typeof LlamaCppBakLLaVA1Prompt;
