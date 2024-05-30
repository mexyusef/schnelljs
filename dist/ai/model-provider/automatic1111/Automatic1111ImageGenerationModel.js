import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { Automatic1111ApiConfiguration } from "./Automatic1111ApiConfiguration.js";
import { failedAutomatic1111CallResponseHandler } from "./Automatic1111Error.js";
import { mapBasicPromptToAutomatic1111Format, } from "./Automatic1111ImageGenerationPrompt.js";
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 */
export class Automatic1111ImageGenerationModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Automatic1111"
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(input, callOptions) {
        const api = this.settings.api ?? new Automatic1111ApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/txt2img`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    prompt: input.prompt,
                    negative_prompt: input.negativePrompt,
                    seed: this.settings.seed,
                    batch_size: this.settings.numberOfGenerations,
                    height: this.settings.height,
                    width: this.settings.width,
                    cfg_scale: this.settings.cfgScale,
                    sampler_index: this.settings.sampler,
                    steps: this.settings.steps,
                    override_settings: {
                        sd_model_checkpoint: this.settings.model,
                    },
                },
                failedResponseHandler: failedAutomatic1111CallResponseHandler,
                successfulResponseHandler: createJsonResponseHandler(zodSchema(Automatic1111ImageGenerationResponseSchema)),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            "height",
            "width",
            "sampler",
            "steps",
            "cfgScale",
            "seed",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateImages(prompt, options) {
        const rawResponse = await this.callAPI(prompt, options);
        return {
            rawResponse,
            base64Images: rawResponse.images,
        };
    }
    withTextPrompt() {
        return this.withPromptTemplate(mapBasicPromptToAutomatic1111Format());
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateImageGenerationModel({
            model: this,
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new Automatic1111ImageGenerationModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const Automatic1111ImageGenerationResponseSchema = z.object({
    images: z.array(z.string()),
    parameters: z.object({}),
    info: z.string(),
});
