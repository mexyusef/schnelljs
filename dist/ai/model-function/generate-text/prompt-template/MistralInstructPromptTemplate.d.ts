import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a Mistral instruct prompt.
 *
 * Mistral prompt template:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Mistral prompt template when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s>[INST] ${instruction} [/INST] ${ response prefix }
 * ```
 *
 * Mistral prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ instruction } [/INST] ${ response prefix }
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Mistral prompt template when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s> [INST] ${ user msg 1 } [/INST] ${ model response 1 } [INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * Mistral prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ user msg 1 } [/INST] ${ model response 1 } </s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
/**
 * Checks if a Mistral chat prompt is valid. Throws a {@link ChatPromptValidationError} if it's not.
 *
 * - The first message of the chat must be a user message.
 * - Then it must be alternating between an assistant message and a user message.
 * - The last message must always be a user message (when submitting to a model).
 *
 * The type checking is done at runtime when you submit a chat prompt to a model with a prompt template.
 *
 * @throws {@link ChatPromptValidationError}
 */
export declare function validateMistralPrompt(chatPrompt: ChatPrompt): void;
