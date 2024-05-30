import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a basic text prompt. Does not change the text prompt in any way.
 */
export declare const text: () => TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a basic text prompt.
 */
export declare const instruction: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a basic text prompt.
 *
 * @param user The label of the user in the chat. Default to "user".
 * @param assistant The label of the assistant in the chat. Default to "assistant".
 * @param system The label of the system in the chat. Optional, defaults to no prefix.
 */
export declare const chat: (options?: {
    user?: string;
    assistant?: string;
    system?: string;
}) => TextGenerationPromptTemplate<ChatPrompt, string>;
