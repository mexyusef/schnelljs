import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
import { TikTokenTokenizer } from "./TikTokenTokenizer.js";
export declare const OPENAI_TEXT_EMBEDDING_MODELS: {
    "text-embedding-ada-002": {
        contextWindowSize: number;
        embeddingDimensions: number;
        tokenCostInMillicents: number;
    };
};
export type OpenAITextEmbeddingModelType = keyof typeof OPENAI_TEXT_EMBEDDING_MODELS;
export declare const isOpenAIEmbeddingModel: (model: string) => model is "text-embedding-ada-002";
export declare const calculateOpenAIEmbeddingCostInMillicents: ({ model, responses, }: {
    model: OpenAITextEmbeddingModelType;
    responses: OpenAITextEmbeddingResponse[];
}) => number;
export interface OpenAITextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    maxValuesPerCall?: number | undefined;
    model: OpenAITextEmbeddingModelType;
    isUserIdForwardingEnabled?: boolean;
}
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany(
 *   new OpenAITextEmbeddingModel({ model: "text-embedding-ada-002" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export declare class OpenAITextEmbeddingModel extends AbstractModel<OpenAITextEmbeddingModelSettings> implements EmbeddingModel<string, OpenAITextEmbeddingModelSettings> {
    constructor(settings: OpenAITextEmbeddingModelSettings);
    readonly provider: "openai";
    get modelName(): "text-embedding-ada-002";
    get maxValuesPerCall(): number;
    readonly isParallelizable = true;
    readonly embeddingDimensions: number;
    readonly tokenizer: TikTokenTokenizer;
    readonly contextWindowSize: number;
    countTokens(input: string): Promise<number>;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<OpenAITextEmbeddingResponse>;
    get settingsForEvent(): Partial<OpenAITextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], callOptions: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "list";
            model: string;
            usage: {
                prompt_tokens: number;
                total_tokens: number;
            };
            data: {
                object: "embedding";
                embedding: number[];
                index: number;
            }[];
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: OpenAITextEmbeddingModelSettings): this;
}
declare const openAITextEmbeddingResponseSchema: z.ZodObject<{
    object: z.ZodLiteral<"list">;
    data: z.ZodArray<z.ZodObject<{
        object: z.ZodLiteral<"embedding">;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        object: "embedding";
        embedding: number[];
        index: number;
    }, {
        object: "embedding";
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
    object: "list";
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
}, {
    object: "list";
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
}>;
export type OpenAITextEmbeddingResponse = z.infer<typeof openAITextEmbeddingResponseSchema>;
export {};
