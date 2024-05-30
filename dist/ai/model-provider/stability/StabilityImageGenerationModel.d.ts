import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplate } from "../../model-function/PromptTemplate.js";
import { ImageGenerationModel, ImageGenerationModelSettings } from "../../model-function/generate-image/ImageGenerationModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { StabilityImageGenerationPrompt } from "./StabilityImageGenerationPrompt.js";
declare const stabilityImageGenerationModels: readonly ["stable-diffusion-v1-6", "stable-diffusion-xl-1024-v1-0"];
export type StabilityImageGenerationModelType = (typeof stabilityImageGenerationModels)[number] | (string & {});
export type StabilityImageGenerationStylePreset = "3d-model" | "analog-film" | "anime" | "cinematic" | "comic-book" | "digital-art" | "enhance" | "fantasy-art" | "isometric" | "line-art" | "low-poly" | "modeling-compound" | "neon-punk" | "origami" | "photographic" | "pixel-art" | "tile-texture";
export type StabilityImageGenerationSampler = "DDIM" | "DDPM" | "K_DPMPP_2M" | "K_DPMPP_2S_ANCESTRAL" | "K_DPM_2" | "K_DPM_2_ANCESTRAL" | "K_EULER" | "K_EULER_ANCESTRAL" | "K_HEUN" | "K_LMS";
export type StabilityClipGuidancePreset = "FAST_BLUE" | "FAST_GREEN" | "NONE" | "SIMPLE" | "SLOW" | "SLOWER" | "SLOWEST";
export interface StabilityImageGenerationSettings extends ImageGenerationModelSettings {
    api?: ApiConfiguration;
    model: StabilityImageGenerationModelType;
    height?: number;
    width?: number;
    /**
     * How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)
     */
    cfgScale?: number;
    clipGuidancePreset?: StabilityClipGuidancePreset;
    /**
     * Which sampler to use for the diffusion process.
     * If this value is omitted we'll automatically select an appropriate sampler for you.
     */
    sampler?: StabilityImageGenerationSampler;
    /**
     * Random noise seed (omit this option or use 0 for a random seed).
     */
    seed?: number;
    /**
     * Number of diffusion steps to run.
     */
    steps?: number;
    /**
     * Pass in a style preset to guide the image model towards a particular style.
     */
    stylePreset?: StabilityImageGenerationStylePreset;
}
/**
 * Create an image generation model that calls the Stability AI image generation API.
 *
 * @see https://api.stability.ai/docs#tag/v1generation/operation/textToImage
 *
 * @example
 * const image = await generateImage(
 *   stability.ImageGenerator({
 *     model: "stable-diffusion-v1-6",
 *     cfgScale: 7,
 *     clipGuidancePreset: "FAST_BLUE",
 *     height: 512,
 *     width: 512,
 *     steps: 30,
 *   })
 *   [
 *     { text: "the wicked witch of the west" },
 *     { text: "style of early 19th century painting", weight: 0.5 },
 *   ]
 * );
 */
export declare class StabilityImageGenerationModel extends AbstractModel<StabilityImageGenerationSettings> implements ImageGenerationModel<StabilityImageGenerationPrompt, StabilityImageGenerationSettings> {
    constructor(settings: StabilityImageGenerationSettings);
    readonly provider: "stability";
    get modelName(): StabilityImageGenerationModelType;
    callAPI(input: StabilityImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<StabilityImageGenerationResponse>;
    get settingsForEvent(): Partial<StabilityImageGenerationSettings>;
    doGenerateImages(prompt: StabilityImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<{
        rawResponse: {
            artifacts: {
                base64: string;
                finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
                seed: number;
            }[];
        };
        base64Images: string[];
    }>;
    withTextPrompt(): PromptTemplateImageGenerationModel<string, StabilityImageGenerationPrompt, StabilityImageGenerationSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, StabilityImageGenerationPrompt>): PromptTemplateImageGenerationModel<INPUT_PROMPT, StabilityImageGenerationPrompt, StabilityImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<StabilityImageGenerationSettings>): this;
}
declare const stabilityImageGenerationResponseSchema: z.ZodObject<{
    artifacts: z.ZodArray<z.ZodObject<{
        base64: z.ZodString;
        seed: z.ZodNumber;
        finishReason: z.ZodEnum<["SUCCESS", "ERROR", "CONTENT_FILTERED"]>;
    }, "strip", z.ZodTypeAny, {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }, {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    artifacts: {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }[];
}, {
    artifacts: {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }[];
}>;
export type StabilityImageGenerationResponse = z.infer<typeof stabilityImageGenerationResponseSchema>;
export {};
