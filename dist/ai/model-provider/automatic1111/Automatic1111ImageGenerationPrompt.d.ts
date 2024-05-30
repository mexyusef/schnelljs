import { PromptTemplate } from "../../model-function/PromptTemplate.js";
export type Automatic1111ImageGenerationPrompt = {
    prompt: string;
    negativePrompt?: string;
};
/**
 * Formats a basic text prompt as an Automatic1111 prompt.
 */
export declare function mapBasicPromptToAutomatic1111Format(): PromptTemplate<string, Automatic1111ImageGenerationPrompt>;
