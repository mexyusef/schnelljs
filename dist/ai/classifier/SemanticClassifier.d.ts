import { Vector } from "../core/Vector.js";
import { EmbeddingModel } from "../model-function/embed/EmbeddingModel.js";
export interface SemanticCluster<VALUE, NAME extends string> {
    name: NAME;
    values: VALUE[];
}
export declare class SemanticClassifier<VALUE, CLUSTERS extends Array<SemanticCluster<VALUE, string>>> {
    readonly clusters: CLUSTERS;
    readonly embeddingModel: EmbeddingModel<VALUE>;
    readonly similarityThreshold: number;
    private embeddings;
    constructor({ clusters, embeddingModel, similarityThreshold, }: {
        clusters: CLUSTERS;
        embeddingModel: EmbeddingModel<VALUE>;
        similarityThreshold: number;
    });
    getEmbeddings(): Promise<{
        embedding: Vector;
        clusterValue: VALUE;
        clusterName: string;
    }[]>;
    classify(value: VALUE): Promise<ClusterNames<CLUSTERS> | null>;
}
type ClusterNames<CLUSTERS> = CLUSTERS extends Array<SemanticCluster<unknown, infer NAME>> ? NAME : never;
export {};
