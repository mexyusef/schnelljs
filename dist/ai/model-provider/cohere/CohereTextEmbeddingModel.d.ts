import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
import { FullTokenizer } from "../../model-function/tokenize-text/Tokenizer.js";
export declare const COHERE_TEXT_EMBEDDING_MODELS: {
    "embed-english-light-v2.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-english-v2.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-multilingual-v2.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-english-v3.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-english-light-v3.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-multilingual-v3.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
    "embed-multilingual-light-v3.0": {
        contextWindowSize: number;
        embeddingDimensions: number;
    };
};
export type CohereTextEmbeddingModelType = keyof typeof COHERE_TEXT_EMBEDDING_MODELS;
export interface CohereTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: CohereTextEmbeddingModelType;
    inputType?: "search_document" | "search_query" | "classification" | "clustering";
    truncate?: "NONE" | "START" | "END";
}
/**
 * Create a text embedding model that calls the Cohere Co.Embed API.
 *
 * @see https://docs.cohere.com/reference/embed
 *
 * @example
 * const embeddings = await embedMany(
 *   new CohereTextEmbeddingModel({ model: "embed-english-light-v2.0" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export declare class CohereTextEmbeddingModel extends AbstractModel<CohereTextEmbeddingModelSettings> implements EmbeddingModel<string, CohereTextEmbeddingModelSettings>, FullTokenizer {
    constructor(settings: CohereTextEmbeddingModelSettings);
    readonly provider: "cohere";
    get modelName(): "embed-english-light-v2.0" | "embed-english-v2.0" | "embed-multilingual-v2.0" | "embed-english-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-v3.0" | "embed-multilingual-light-v3.0";
    readonly maxValuesPerCall = 96;
    readonly isParallelizable = true;
    readonly embeddingDimensions: number;
    readonly contextWindowSize: number;
    private readonly tokenizer;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<CohereTextEmbeddingResponse>;
    get settingsForEvent(): Partial<CohereTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embeddings: number[][];
            texts: string[];
            id: string;
            meta: {
                api_version: {
                    version: string;
                };
            };
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<CohereTextEmbeddingModelSettings>): this;
}
declare const cohereTextEmbeddingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    texts: z.ZodArray<z.ZodString, "many">;
    embeddings: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    embeddings: number[][];
    texts: string[];
    id: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}, {
    embeddings: number[][];
    texts: string[];
    id: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}>;
export type CohereTextEmbeddingResponse = z.infer<typeof cohereTextEmbeddingResponseSchema>;
export {};
