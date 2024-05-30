import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { OpenAIChatPrompt } from "./AbstractOpenAIChatModel.js";
/**
 * OpenAIMessage[] identity chat format.
 */
export declare function identity(): TextGenerationPromptTemplate<OpenAIChatPrompt, OpenAIChatPrompt>;
/**
 * Formats a text prompt as an OpenAI chat prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, OpenAIChatPrompt>;
/**
 * Formats an instruction prompt as an OpenAI chat prompt.
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, OpenAIChatPrompt>;
/**
 * Formats a chat prompt as an OpenAI chat prompt.
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, OpenAIChatPrompt>;
