import { Vector } from "../../core/Vector.js";
import { Schema } from "../../core/schema/Schema.js";
import { VectorIndex } from "../VectorIndex.js";
/**
 * A very simple vector index that stores all entries in memory. Useful when you only have
 * a small number of entries and don't want to set up a real database, e.g. for conversational memory
 * that does not need to be persisted.
 */
export declare class MemoryVectorIndex<DATA> implements VectorIndex<DATA, MemoryVectorIndex<DATA>, (value: DATA) => boolean> {
    static deserialize<DATA>({ serializedData, schema, }: {
        serializedData: string;
        schema?: Schema<DATA>;
    }): Promise<MemoryVectorIndex<DATA>>;
    private readonly entries;
    upsertMany(data: Array<{
        id: string;
        vector: Vector;
        data: DATA;
    }>): Promise<void>;
    queryByVector({ queryVector, similarityThreshold, maxResults, filter, }: {
        queryVector: Vector;
        maxResults: number;
        similarityThreshold?: number;
        filter?: (value: DATA) => boolean;
    }): Promise<Array<{
        id: string;
        data: DATA;
        similarity?: number;
    }>>;
    serialize(): string;
    asIndex(): MemoryVectorIndex<DATA>;
}
