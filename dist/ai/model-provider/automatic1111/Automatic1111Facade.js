import { Automatic1111ApiConfiguration } from "./Automatic1111ApiConfiguration.js";
import { Automatic1111ImageGenerationModel, } from "./Automatic1111ImageGenerationModel.js";
/**
 * Creates an API configuration for the AUTOMATIC1111 Stable Diffusion Web UI API.
 * It calls the API at http://127.0.0.1:7860/sdapi/v1 by default.
 */
export function Api(settings) {
    return new Automatic1111ApiConfiguration(settings);
}
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 *
 * @return A new instance of ${@link Automatic1111ImageGenerationModel}.
 */
export function ImageGenerator(settings) {
    return new Automatic1111ImageGenerationModel(settings);
}
