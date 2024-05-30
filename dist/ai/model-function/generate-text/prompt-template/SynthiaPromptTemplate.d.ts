import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as a Synthia text prompt.
 *
 * Synthia prompt template:
 * ```
 * USER: text
 * ASSISTANT:
 * ```
 */
export declare const text: () => TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: instruction
 * ASSISTANT: response prefix
 * ```
 */
export declare const instruction: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: user message
 * ASSISTANT: assistant message
 * ```
 */
export declare const chat: () => TextGenerationPromptTemplate<ChatPrompt, string>;
