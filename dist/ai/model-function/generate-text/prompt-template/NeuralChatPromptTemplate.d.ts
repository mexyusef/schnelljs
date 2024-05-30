import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a neural chat prompt.
 *
 * @see https://huggingface.co/Intel/neural-chat-7b-v3-1#prompt-template
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a neural chat prompt.
 *
 * @see https://huggingface.co/Intel/neural-chat-7b-v3-1#prompt-template
 */
export declare const instruction: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a basic text prompt.
 *
 * @param user The label of the user in the chat. Default to "user".
 * @param assistant The label of the assistant in the chat. Default to "assistant".
 * @param system The label of the system in the chat. Optional, defaults to no prefix.
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
