import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { StabilityApiConfiguration } from "./StabilityApiConfiguration.js";
import { failedStabilityCallResponseHandler } from "./StabilityError.js";
import { mapBasicPromptToStabilityFormat, } from "./StabilityImageGenerationPrompt.js";
const stabilityImageGenerationModels = [
    "stable-diffusion-v1-6",
    "stable-diffusion-xl-1024-v1-0",
];
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
export class StabilityImageGenerationModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "stability"
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(input, callOptions) {
        const api = this.settings.api ?? new StabilityApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: this.settings.api?.retry,
            throttle: this.settings.api?.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/generation/${this.settings.model}/text-to-image`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    height: this.settings.height,
                    width: this.settings.width,
                    text_prompts: input,
                    cfg_scale: this.settings.cfgScale,
                    clip_guidance_preset: this.settings.clipGuidancePreset,
                    sampler: this.settings.sampler,
                    samples: this.settings.numberOfGenerations,
                    seed: this.settings.seed,
                    steps: this.settings.steps,
                    style_preset: this.settings.stylePreset,
                },
                failedResponseHandler: failedStabilityCallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(stabilityImageGenerationResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            numberOfGenerations: this.settings.numberOfGenerations,
            height: this.settings.height,
            width: this.settings.width,
            cfgScale: this.settings.cfgScale,
            clipGuidancePreset: this.settings.clipGuidancePreset,
            sampler: this.settings.sampler,
            seed: this.settings.seed,
            steps: this.settings.steps,
            stylePreset: this.settings.stylePreset,
        };
    }
    async doGenerateImages(prompt, callOptions) {
        const rawResponse = await this.callAPI(prompt, callOptions);
        return {
            rawResponse,
            base64Images: rawResponse.artifacts.map((artifact) => artifact.base64),
        };
    }
    withTextPrompt() {
        return this.withPromptTemplate(mapBasicPromptToStabilityFormat());
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateImageGenerationModel({
            model: this,
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new StabilityImageGenerationModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const stabilityImageGenerationResponseSchema = z.object({
    artifacts: z.array(z.object({
        base64: z.string(),
        seed: z.number(),
        finishReason: z.enum(["SUCCESS", "ERROR", "CONTENT_FILTERED"]),
    })),
});
