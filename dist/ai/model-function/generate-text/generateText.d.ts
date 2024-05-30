import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { TextGenerationModel, TextGenerationModelSettings } from "./TextGenerationModel.js";
import { TextGenerationFinishReason, TextGenerationResult } from "./TextGenerationResult.js";
/**
 * Generate text for a prompt and return it as a string.
 *
 * The prompt depends on the model used.
 * For instance, OpenAI completion models expect a string prompt,
 * whereas OpenAI chat models expect an array of chat messages.
 *
 * @see https://modelfusion.dev/guide/function/generate-text
 *
 * @example
 * const text = await generateText({
 *   model: openai.CompletionTextGenerator(...),
 *   prompt: "Write a short story about a robot learning to love:\n\n"
 * });
 *
 * @param {TextGenerationModel<PROMPT, TextGenerationModelSettings>} model - The text generation model to use.
 * @param {PROMPT} prompt - The prompt to use for text generation.
 *
 * @returns {Promise<string>} - A promise that resolves to the generated text.
 */
export declare function generateText<PROMPT>(args: {
    model: TextGenerationModel<PROMPT, TextGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse?: false;
} & FunctionOptions): Promise<string>;
export declare function generateText<PROMPT>(args: {
    model: TextGenerationModel<PROMPT, TextGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse: true;
} & FunctionOptions): Promise<{
    text: string;
    finishReason: TextGenerationFinishReason;
    texts: string[];
    textGenerationResults: TextGenerationResult[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
