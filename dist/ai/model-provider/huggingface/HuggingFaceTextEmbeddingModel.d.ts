import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { EmbeddingModel, EmbeddingModelSettings } from "../../model-function/embed/EmbeddingModel.js";
export interface HuggingFaceTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: string;
    maxValuesPerCall?: number;
    embeddingDimensions?: number;
    options?: {
        useCache?: boolean;
        waitForModel?: boolean;
    };
}
/**
 * Create a text embedding model that calls a Hugging Face Inference API Feature Extraction Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#feature-extraction-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "intfloat/e5-base-v2",
 *   maxTexstsPerCall: 5,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const embeddings = await embedMany(
 *   model,
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
export declare class HuggingFaceTextEmbeddingModel extends AbstractModel<HuggingFaceTextEmbeddingModelSettings> implements EmbeddingModel<string, HuggingFaceTextEmbeddingModelSettings> {
    constructor(settings: HuggingFaceTextEmbeddingModelSettings);
    readonly provider = "huggingface";
    get modelName(): string;
    readonly maxValuesPerCall: number;
    readonly isParallelizable = true;
    readonly contextWindowSize: undefined;
    readonly embeddingDimensions: number | undefined;
    readonly tokenizer: undefined;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<HuggingFaceTextEmbeddingResponse>;
    get settingsForEvent(): Partial<HuggingFaceTextEmbeddingModelSettings>;
    readonly countPromptTokens: undefined;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: number[][];
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<HuggingFaceTextEmbeddingModelSettings>): this;
}
declare const huggingFaceTextEmbeddingResponseSchema: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
export type HuggingFaceTextEmbeddingResponse = z.infer<typeof huggingFaceTextEmbeddingResponseSchema>;
export {};
