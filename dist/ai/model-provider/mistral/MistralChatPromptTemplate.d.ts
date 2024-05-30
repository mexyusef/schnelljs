import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { MistralChatPrompt } from "./MistralChatModel.js";
/**
 * Formats a text prompt as a Mistral prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, MistralChatPrompt>;
/**
 * Formats an instruction prompt as a Mistral prompt.
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, MistralChatPrompt>;
/**
 * Formats a chat prompt as a Mistral prompt.
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, MistralChatPrompt>;
