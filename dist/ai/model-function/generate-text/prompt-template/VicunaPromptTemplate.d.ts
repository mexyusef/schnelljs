import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a Vicuna prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Vicuna prompt.
 */
export declare const instruction: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Vicuna prompt.
 *
 * Overriding the system message in the first chat message can affect model responses.
 *
 * Vicuna prompt template:
 * ```
 * A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.
 *
 * USER: {prompt}
 * ASSISTANT:
 * ```
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
