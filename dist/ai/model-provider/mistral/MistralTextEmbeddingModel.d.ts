import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
export interface MistralTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    /**
     * The ID of the model to use for this request.
     */
    model: "mistral-embed";
    /**
     * The format of the output data.
     *
     * Default: "float"
     */
    encodingFormat?: "float";
}
export declare class MistralTextEmbeddingModel extends AbstractModel<MistralTextEmbeddingModelSettings> implements EmbeddingModel<string, MistralTextEmbeddingModelSettings> {
    constructor(settings: MistralTextEmbeddingModelSettings);
    readonly provider: "mistral";
    get modelName(): "mistral-embed";
    readonly maxValuesPerCall = 32;
    /**
     * Parallel calls are technically possible, but I have been hitting rate limits and disabled
     * them for now.
     */
    readonly isParallelizable = false;
    readonly embeddingDimensions = 1024;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<MistralTextEmbeddingResponse>;
    get settingsForEvent(): Partial<MistralTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                total_tokens: number;
            };
            data: {
                object: string;
                embedding: number[];
                index: number;
            }[];
            id: string;
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<MistralTextEmbeddingModelSettings>): this;
}
declare const MistralTextEmbeddingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodString;
    data: z.ZodArray<z.ZodObject<{
        object: z.ZodString;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        object: string;
        embedding: number[];
        index: number;
    }, {
        object: string;
        embedding: number[];
        index: number;
    }>, "many">;
    model: z.ZodString;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    id: string;
}, {
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    id: string;
}>;
export type MistralTextEmbeddingResponse = z.infer<typeof MistralTextEmbeddingResponseSchema>;
export {};
