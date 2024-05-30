import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { failedOpenAICallResponseHandler } from "./OpenAIError.js";
export const OPENAI_IMAGE_MODELS = {
    "dall-e-2": {
        getCost(settings) {
            switch (settings.size ?? "1024x1024") {
                case "1024x1024":
                    return 2000;
                case "512x512":
                    return 1800;
                case "256x256":
                    return 1600;
                default:
                    return null;
            }
        },
    },
    "dall-e-3": {
        getCost(settings) {
            switch (settings.quality ?? "standard") {
                case "standard": {
                    switch (settings.size ?? "1024x1024") {
                        case "1024x1024":
                            return 4000;
                        case "1024x1792":
                        case "1792x1024":
                            return 8000;
                        default:
                            return null;
                    }
                }
                case "hd": {
                    switch (settings.size ?? "1024x1024") {
                        case "1024x1024":
                            return 8000;
                        case "1024x1792":
                        case "1792x1024":
                            return 12000;
                        default:
                            return null;
                    }
                }
            }
        },
    },
};
/**
 * @see https://openai.com/pricing
 */
export const calculateOpenAIImageGenerationCostInMillicents = ({ model, settings, }) => {
    const cost = OPENAI_IMAGE_MODELS[model]?.getCost(settings);
    if (cost == null) {
        return null;
    }
    return (settings.numberOfGenerations ?? 1) * cost;
};
/**
 * Create an image generation model that calls the OpenAI AI image creation API.
 *
 * @see https://platform.openai.com/docs/api-reference/images/create
 *
 * @example
 * const image = await generateImage(
 *   new OpenAIImageGenerationModel({ size: "512x512" }),
 *   "the wicked witch of the west in the style of early 19th century painting"
 * );
 */
export class OpenAIImageGenerationModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "openai"
        });
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(prompt, callOptions, options) {
        const api = this.settings.api ?? new OpenAIApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        const userId = callOptions.run?.userId;
        const responseFormat = options.responseFormat;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl("/images/generations"),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    prompt,
                    n: this.settings.numberOfGenerations,
                    size: this.settings.size,
                    response_format: responseFormat.type,
                    user: this.settings.isUserIdForwardingEnabled ? userId : undefined,
                },
                failedResponseHandler: failedOpenAICallResponseHandler,
                successfulResponseHandler: responseFormat.handler,
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            "numberOfGenerations",
            "size",
            "quality",
            "style",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    async doGenerateImages(prompt, options) {
        const rawResponse = await this.callAPI(prompt, options, {
            responseFormat: OpenAIImageGenerationResponseFormat.base64Json,
        });
        return {
            rawResponse,
            base64Images: rawResponse.data.map((item) => item.b64_json),
        };
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateImageGenerationModel({
            model: this,
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new OpenAIImageGenerationModel(Object.assign({}, this.settings, additionalSettings));
    }
}
const openAIImageGenerationUrlSchema = z.object({
    created: z.number(),
    data: z.array(z.object({
        url: z.string(),
    })),
});
const openAIImageGenerationBase64JsonSchema = z.object({
    created: z.number(),
    data: z.array(z.object({
        b64_json: z.string(),
    })),
});
export const OpenAIImageGenerationResponseFormat = {
    url: {
        type: "url",
        handler: createJsonResponseHandler(zodSchema(openAIImageGenerationUrlSchema)),
    },
    base64Json: {
        type: "b64_json",
        handler: createJsonResponseHandler(zodSchema(openAIImageGenerationBase64JsonSchema)),
    },
};
