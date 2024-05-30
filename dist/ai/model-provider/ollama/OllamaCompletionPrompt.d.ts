import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { TextGenerationPromptTemplateProvider } from "../../model-function/generate-text/prompt-template/PromptTemplateProvider.js";
import { OllamaCompletionPrompt } from "./OllamaCompletionModel.js";
export declare function asOllamaCompletionPromptTemplate<SOURCE_PROMPT>(promptTemplate: TextGenerationPromptTemplate<SOURCE_PROMPT, string>): TextGenerationPromptTemplate<SOURCE_PROMPT, OllamaCompletionPrompt>;
export declare function asOllamaCompletionTextPromptTemplateProvider(promptTemplateProvider: TextGenerationPromptTemplateProvider<string>): TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const Text: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
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
export declare const Mistral: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const ChatML: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const Llama2: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const NeuralChat: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const Alpaca: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const Synthia: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
export declare const Vicuna: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt>;
