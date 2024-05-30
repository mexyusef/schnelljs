import { z } from "zod";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { parseJSON } from "../../core/schema/parseJSON.js";
import { cosineSimilarity } from "../../util/cosineSimilarity.js";
const jsonDataSchema = zodSchema(z.array(z.object({
    id: z.string(),
    vector: z.array(z.number()),
    data: z.unknown(),
})));
/**
 * A very simple vector index that stores all entries in memory. Useful when you only have
 * a small number of entries and don't want to set up a real database, e.g. for conversational memory
 * that does not need to be persisted.
 */
export class MemoryVectorIndex {
    constructor() {
        Object.defineProperty(this, "entries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    static async deserialize({ serializedData, schema, }) {
        // validate the outer structure:
        const json = parseJSON({ text: serializedData, schema: jsonDataSchema });
        if (schema != null) {
            // when a schema is provided, validate all entries:
            for (const entry of json) {
                const validationResult = schema.validate(entry.data);
                if (!validationResult.success) {
                    throw validationResult.error;
                }
            }
        }
        const vectorIndex = new MemoryVectorIndex();
        vectorIndex.upsertMany(json);
        return vectorIndex;
    }
    async upsertMany(data) {
        for (const entry of data) {
            this.entries.set(entry.id, entry);
        }
    }
    async queryByVector({ queryVector, similarityThreshold, maxResults, filter, }) {
        const results = [...this.entries.values()]
            .filter((value) => filter?.(value.data) ?? true)
            .map((entry) => ({
            id: entry.id,
            similarity: cosineSimilarity(entry.vector, queryVector),
            data: entry.data,
        }))
            .filter((entry) => similarityThreshold == undefined ||
            entry.similarity == undefined ||
            entry.similarity > similarityThreshold);
        results.sort((a, b) => b.similarity - a.similarity);
        return results.slice(0, maxResults);
    }
    serialize() {
        return JSON.stringify([...this.entries.values()]);
    }
    asIndex() {
        return this;
    }
}
