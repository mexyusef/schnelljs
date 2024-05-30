import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * @see https://www.philschmid.de/llama-2#how-to-prompt-llama-2-chat
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] <<SYS>>
 * ${ system prompt }
 * <</SYS>>
 * ${ instruction }
 * [/INST]
 * ${ response prefix }
 * ```
 *
 * @see https://www.philschmid.de/llama-2#how-to-prompt-llama-2-chat
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] <<SYS>>
 * ${ system prompt }
 * <</SYS>>
 *
 * ${ user msg 1 } [/INST] ${ model response 1 } </s><s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } </s><s>[INST] ${ user msg 3 } [/INST]
 * ```
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
/**
 * Checks if a Llama2 chat prompt is valid. Throws a {@link ChatPromptValidationError} if it's not.
 *
 * - The first message of the chat must be a user message.
 * - Then it must be alternating between an assistant message and a user message.
 * - The last message must always be a user message (when submitting to a model).
 *
 * The type checking is done at runtime when you submit a chat prompt to a model with a prompt template.
 *
 * @throws {@link ChatPromptValidationError}
 */
export declare function validateLlama2Prompt(chatPrompt: ChatPrompt): void;
