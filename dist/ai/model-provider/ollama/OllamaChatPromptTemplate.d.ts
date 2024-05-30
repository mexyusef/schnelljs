import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { OllamaChatPrompt } from "./OllamaChatModel.js";
/**
 * OllamaChatPrompt identity chat format.
 */
export declare function identity(): TextGenerationPromptTemplate<OllamaChatPrompt, OllamaChatPrompt>;
/**
 * Formats a text prompt as an Ollama chat prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, OllamaChatPrompt>;
/**
 * Formats an instruction prompt as an Ollama chat prompt.
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, OllamaChatPrompt>;
/**
 * Formats a chat prompt as an Ollama chat prompt.
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, OllamaChatPrompt>;
