import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { TextStreamingModel } from "./TextGenerationModel.js";
/**
 * Stream the generated text for a prompt as an async iterable.
 *
 * The prompt depends on the model used.
 * For instance, OpenAI completion models expect a string prompt,
 * whereas OpenAI chat models expect an array of chat messages.
 *
 * @see https://modelfusion.dev/guide/function/generate-text
 *
 * @example
 * const textStream = await streamText({
 *   model: openai.CompletionTextGenerator(...),
 *   prompt: "Write a short story about a robot learning to love:\n\n"
 * });
 *
 * for await (const textPart of textStream) {
 *   // ...
 * }
 *
 * @param {TextStreamingModel<PROMPT>} model - The model to stream text from.
 * @param {PROMPT} prompt - The prompt to use for text generation.
 * @param {FunctionOptions} [options] - Optional parameters for the function.
 *
 * @returns {AsyncIterableResultPromise<string>} An async iterable promise that yields the generated text.
 */
export declare function streamText<PROMPT>(args: {
    model: TextStreamingModel<PROMPT>;
    prompt: PROMPT;
    fullResponse?: false;
} & FunctionOptions): Promise<AsyncIterable<string>>;
export declare function streamText<PROMPT>(args: {
    model: TextStreamingModel<PROMPT>;
    prompt: PROMPT;
    fullResponse: true;
} & FunctionOptions): Promise<{
    textStream: AsyncIterable<string>;
    text: PromiseLike<string>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;
