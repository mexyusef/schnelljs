import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
export interface LlamaCppTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    embeddingDimensions?: number;
    isParallelizable?: boolean;
}
export declare class LlamaCppTextEmbeddingModel extends AbstractModel<LlamaCppTextEmbeddingModelSettings> implements EmbeddingModel<string, LlamaCppTextEmbeddingModelSettings> {
    constructor(settings?: LlamaCppTextEmbeddingModelSettings);
    readonly provider: "llamacpp";
    get modelName(): null;
    readonly maxValuesPerCall = 1;
    get isParallelizable(): boolean;
    readonly contextWindowSize: undefined;
    get embeddingDimensions(): number | undefined;
    private readonly tokenizer;
    tokenize(text: string): Promise<number[]>;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<LlamaCppTextEmbeddingResponse>;
    get settingsForEvent(): Partial<LlamaCppTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embedding: number[];
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<LlamaCppTextEmbeddingModelSettings>): this;
}
declare const llamaCppTextEmbeddingResponseSchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
}, {
    embedding: number[];
}>;
export type LlamaCppTextEmbeddingResponse = z.infer<typeof llamaCppTextEmbeddingResponseSchema>;
export {};
