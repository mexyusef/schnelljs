import { PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
import { Automatic1111ApiConfiguration } from "./Automatic1111ApiConfiguration.js";
import { Automatic1111ImageGenerationModel, Automatic1111ImageGenerationSettings } from "./Automatic1111ImageGenerationModel.js";
/**
 * Creates an API configuration for the AUTOMATIC1111 Stable Diffusion Web UI API.
 * It calls the API at http://127.0.0.1:7860/sdapi/v1 by default.
 */
export declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions): Automatic1111ApiConfiguration;
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 *
 * @return A new instance of ${@link Automatic1111ImageGenerationModel}.
 */
export declare function ImageGenerator(settings: Automatic1111ImageGenerationSettings): Automatic1111ImageGenerationModel;
