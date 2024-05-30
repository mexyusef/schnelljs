import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplate } from "../../model-function/PromptTemplate.js";
import { ImageGenerationModel, ImageGenerationModelSettings } from "../../model-function/generate-image/ImageGenerationModel.js";
import { PromptTemplateImageGenerationModel } from "../../model-function/generate-image/PromptTemplateImageGenerationModel.js";
export declare const OPENAI_IMAGE_MODELS: {
    "dall-e-2": {
        getCost(settings: OpenAIImageGenerationSettings): 2000 | 1800 | 1600 | null;
    };
    "dall-e-3": {
        getCost(settings: OpenAIImageGenerationSettings): 4000 | 8000 | 12000 | null;
    };
};
/**
 * @see https://openai.com/pricing
 */
export declare const calculateOpenAIImageGenerationCostInMillicents: ({ model, settings, }: {
    model: OpenAIImageModelType;
    settings: OpenAIImageGenerationSettings;
}) => number | null;
export type OpenAIImageModelType = keyof typeof OPENAI_IMAGE_MODELS;
export interface OpenAIImageGenerationCallSettings {
    model: OpenAIImageModelType;
    size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
    quality?: "standard" | "hd";
    style?: "vivid" | "natural";
}
export interface OpenAIImageGenerationSettings extends ImageGenerationModelSettings, OpenAIImageGenerationCallSettings {
    api?: ApiConfiguration;
    isUserIdForwardingEnabled?: boolean;
}
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
export declare class OpenAIImageGenerationModel extends AbstractModel<OpenAIImageGenerationSettings> implements ImageGenerationModel<string, OpenAIImageGenerationSettings> {
    constructor(settings: OpenAIImageGenerationSettings);
    readonly provider: "openai";
    get modelName(): "dall-e-2" | "dall-e-3";
    callAPI<RESULT>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAIImageGenerationResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<OpenAIImageGenerationSettings>;
    doGenerateImages(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            data: {
                b64_json: string;
            }[];
            created: number;
        };
        base64Images: string[];
    }>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, string>): PromptTemplateImageGenerationModel<INPUT_PROMPT, string, OpenAIImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<OpenAIImageGenerationSettings>): this;
}
export type OpenAIImageGenerationResponseFormatType<T> = {
    type: "b64_json" | "url";
    handler: ResponseHandler<T>;
};
declare const openAIImageGenerationUrlSchema: z.ZodObject<{
    created: z.ZodNumber;
    data: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: {
        url: string;
    }[];
    created: number;
}, {
    data: {
        url: string;
    }[];
    created: number;
}>;
export type OpenAIImageGenerationUrlResponse = z.infer<typeof openAIImageGenerationUrlSchema>;
declare const openAIImageGenerationBase64JsonSchema: z.ZodObject<{
    created: z.ZodNumber;
    data: z.ZodArray<z.ZodObject<{
        b64_json: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        b64_json: string;
    }, {
        b64_json: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: {
        b64_json: string;
    }[];
    created: number;
}, {
    data: {
        b64_json: string;
    }[];
    created: number;
}>;
export type OpenAIImageGenerationBase64JsonResponse = z.infer<typeof openAIImageGenerationBase64JsonSchema>;
export declare const OpenAIImageGenerationResponseFormat: {
    url: {
        type: "url";
        handler: ResponseHandler<{
            data: {
                url: string;
            }[];
            created: number;
        }>;
    };
    base64Json: {
        type: "b64_json";
        handler: ResponseHandler<{
            data: {
                b64_json: string;
            }[];
            created: number;
        }>;
    };
};
export {};
