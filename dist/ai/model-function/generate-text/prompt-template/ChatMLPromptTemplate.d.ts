import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt using the ChatML format.
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * ${ system prompt }<|im_end|>
 * <|im_start|>user
 * ${ instruction }<|im_end|>
 * <|im_start|>assistant
 * ${response prefix}
 * ```
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * You are a helpful assistant that answers questions about the world.<|im_end|>
 * <|im_start|>user
 * What is the capital of France?<|im_end|>
 * <|im_start|>assistant
 * Paris<|im_end|>
 * ```
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
