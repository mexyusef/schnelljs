import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplate } from "../../model-function/PromptTemplate.js";
import { ImageGenerationModel, ImageGenerationModelSettings } from "../../model-function/generate-image/ImageGenerationModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { Automatic1111ImageGenerationPrompt } from "./Automatic1111ImageGenerationPrompt.js";
export interface Automatic1111ImageGenerationSettings extends ImageGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * Stable Diffusion checkpoint.
     */
    model: string;
    height?: number;
    width?: number;
    /**
     * Sampling method.
     */
    sampler?: string;
    /**
     * Sampling steps.
     */
    steps?: number;
    /**
     * CFG Scale.
     */
    cfgScale?: number;
    seed?: number;
}
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 */
export declare class Automatic1111ImageGenerationModel extends AbstractModel<Automatic1111ImageGenerationSettings> implements ImageGenerationModel<Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings> {
    constructor(settings: Automatic1111ImageGenerationSettings);
    readonly provider: "Automatic1111";
    get modelName(): string;
    callAPI(input: Automatic1111ImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<Automatic1111ImageGenerationResponse>;
    get settingsForEvent(): Partial<Automatic1111ImageGenerationSettings>;
    doGenerateImages(prompt: Automatic1111ImageGenerationPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            images: string[];
            parameters: {};
            info: string;
        };
        base64Images: string[];
    }>;
    withTextPrompt(): PromptTemplateImageGenerationModel<string, Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, Automatic1111ImageGenerationPrompt>): PromptTemplateImageGenerationModel<INPUT_PROMPT, Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<Automatic1111ImageGenerationSettings>): this;
}
declare const Automatic1111ImageGenerationResponseSchema: z.ZodObject<{
    images: z.ZodArray<z.ZodString, "many">;
    parameters: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    info: z.ZodString;
}, "strip", z.ZodTypeAny, {
    images: string[];
    parameters: {};
    info: string;
}, {
    images: string[];
    parameters: {};
    info: string;
}>;
export type Automatic1111ImageGenerationResponse = z.infer<typeof Automatic1111ImageGenerationResponseSchema>;
export {};
