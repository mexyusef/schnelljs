import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
export interface OllamaTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: string;
    embeddingDimensions?: number;
    isParallelizable?: boolean;
}
export declare class OllamaTextEmbeddingModel extends AbstractModel<OllamaTextEmbeddingModelSettings> implements EmbeddingModel<string, OllamaTextEmbeddingModelSettings> {
    constructor(settings: OllamaTextEmbeddingModelSettings);
    readonly provider: "ollama";
    get modelName(): null;
    readonly maxValuesPerCall = 1;
    get isParallelizable(): boolean;
    get embeddingDimensions(): number | undefined;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<OllamaTextEmbeddingResponse>;
    get settingsForEvent(): Partial<OllamaTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embedding: number[];
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<OllamaTextEmbeddingModelSettings>): this;
}
declare const ollamaTextEmbeddingResponseSchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
}, {
    embedding: number[];
}>;
export type OllamaTextEmbeddingResponse = z.infer<typeof ollamaTextEmbeddingResponseSchema>;
export {};
