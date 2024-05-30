import { PromptTemplate } from "../../model-function/PromptTemplate.js";
export type StabilityImageGenerationPrompt = Array<{
    text: string;
    weight?: number;
}>;
/**
 * Formats a basic text prompt as a Stability prompt.
 */
export declare function mapBasicPromptToStabilityFormat(): PromptTemplate<string, StabilityImageGenerationPrompt>;
