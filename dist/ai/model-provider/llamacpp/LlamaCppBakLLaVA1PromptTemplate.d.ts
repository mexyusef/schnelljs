import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ChatPrompt } from "../../model-function/generate-text/prompt-template/ChatPrompt.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { LlamaCppCompletionPrompt } from "./LlamaCppCompletionModel.js";
/**
 * Text prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, LlamaCppCompletionPrompt>;
/**
 * BakLLaVA 1 uses a Vicuna 1 prompt. This mapping combines it with the LlamaCpp prompt structure.
 *
 * @see https://github.com/SkunkworksAI/BakLLaVA
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, LlamaCppCompletionPrompt>;
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, LlamaCppCompletionPrompt>;
