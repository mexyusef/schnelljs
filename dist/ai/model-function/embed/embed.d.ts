import { FunctionOptions } from "../../core/FunctionOptions.js";
import { Vector } from "../../core/Vector.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { EmbeddingModel, EmbeddingModelSettings } from "./EmbeddingModel.js";
/**
 * Generate embeddings for multiple values.
 *
 * @see https://modelfusion.dev/guide/function/embed
 *
 * @example
 * const embeddings = await embedMany({
 *   embedder: openai.TextEmbedder(...),
 *   values: [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * });
 *
 * @param {EmbeddingModel<VALUE, EmbeddingModelSettings>} model - The model to use for generating embeddings.
 * @param {VALUE[]} values - The values to generate embeddings for.
 *
 * @returns {Promise<Vector[]>} - A promise that resolves to an array of vectors representing the embeddings.
 */
export declare function embedMany<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    values: VALUE[];
    fullResponse?: false;
} & FunctionOptions): Promise<Vector[]>;
export declare function embedMany<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    values: VALUE[];
    fullResponse: true;
} & FunctionOptions): Promise<{
    embeddings: Vector[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
/**
 * Generate an embedding for a single value.
 *
 * @see https://modelfusion.dev/guide/function/embed
 *
 * @example
 * const embedding = await embed({
 *   model: openai.TextEmbedder(...),
 *   value: "At first, Nox didn't know what to do with the pup."
 * });
 *
 * @param {EmbeddingModel<VALUE, EmbeddingModelSettings>} model - The model to use for generating the embedding.
 * @param {VALUE} value - The value to generate an embedding for.
 *
 * @returns {Promise<Vector>} - A promise that resolves to a vector representing the embedding.
 */
export declare function embed<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    value: VALUE;
    fullResponse?: false;
} & FunctionOptions): Promise<Vector>;
export declare function embed<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    value: VALUE;
    fullResponse: true;
} & FunctionOptions): Promise<{
    embedding: Vector;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
