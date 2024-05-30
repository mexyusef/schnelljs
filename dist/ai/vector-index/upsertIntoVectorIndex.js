import { nanoid as createId } from "nanoid";
import { executeFunctionCall } from "../core/executeFunctionCall.js";
import { embedMany } from "../model-function/embed/embed.js";
export async function upsertIntoVectorIndex({ vectorIndex, embeddingModel, generateId = createId, objects, getValueToEmbed, getId, }, options) {
    return executeFunctionCall({
        options,
        input: objects,
        functionType: "upsert-into-vector-index",
        inputPropertyName: "objects",
        execute: async (options) => {
            // many embedding models support bulk embedding, so we first embed all texts:
            const embeddings = await embedMany({
                model: embeddingModel,
                values: objects.map(getValueToEmbed),
                ...options,
            });
            await vectorIndex.upsertMany(objects.map((object, i) => ({
                id: getId?.(object, i) ?? generateId(),
                vector: embeddings[i],
                data: object,
            })));
        },
    });
}
