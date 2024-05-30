/// <reference types="node" />
import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { ImageGenerationModel, ImageGenerationModelSettings } from "./ImageGenerationModel.js";
/**
 * Generates an image using a prompt.
 *
 * The prompt depends on the model. For example, OpenAI image models expect a string prompt,
 * and Stability AI models expect an array of text prompts with optional weights.
 *
 * @see https://modelfusion.dev/guide/function/generate-image
 *
 * @example
 * const image = await generateImage({
 *   imageGenerator: stability.ImageGenerator(...),
 *   prompt: [
 *     { text: "the wicked witch of the west" },
 *     { text: "style of early 19th century painting", weight: 0.5 },
 *   ]
 * });
 *
 * @param {ImageGenerationModel<PROMPT, ImageGenerationModelSettings>} model - The image generation model to be used.
 * @param {PROMPT} prompt - The prompt to be used for image generation.
 *
 * @returns {Promise} - Returns a promise that resolves to the generated image.
 * The image is a Buffer containing the image data in PNG format.
 */
export declare function generateImage<PROMPT>(args: {
    model: ImageGenerationModel<PROMPT, ImageGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse?: false;
} & FunctionOptions): Promise<Buffer>;
export declare function generateImage<PROMPT>(args: {
    model: ImageGenerationModel<PROMPT, ImageGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse: true;
} & FunctionOptions): Promise<{
    image: Buffer;
    imageBase64: string;
    images: Buffer[];
    imagesBase64: string[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
