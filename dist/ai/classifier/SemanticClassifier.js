import { embed, embedMany } from "../model-function/embed/embed.js";
import { cosineSimilarity } from "../util/cosineSimilarity.js";
export class SemanticClassifier {
    constructor({ clusters, embeddingModel, similarityThreshold, }) {
        Object.defineProperty(this, "clusters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "similarityThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.clusters = clusters;
        this.embeddingModel = embeddingModel;
        this.similarityThreshold = similarityThreshold;
    }
    async getEmbeddings() {
        if (this.embeddings != null) {
            return this.embeddings;
        }
        const embeddings = [];
        for (const cluster of this.clusters) {
            const clusterEmbeddings = await embedMany({
                model: this.embeddingModel,
                values: cluster.values,
            });
            for (let i = 0; i < clusterEmbeddings.length; i++) {
                embeddings.push({
                    embedding: clusterEmbeddings[i],
                    clusterValue: cluster.values[i],
                    clusterName: cluster.name,
                });
            }
        }
        this.embeddings = embeddings; // lazy caching
        return embeddings;
    }
    async classify(value) {
        const valueEmbedding = await embed({
            model: this.embeddingModel,
            value,
        });
        const clusterEmbeddings = await this.getEmbeddings();
        const allMatches = [];
        for (const embedding of clusterEmbeddings) {
            const similarity = cosineSimilarity(valueEmbedding, embedding.embedding);
            if (similarity >= this.similarityThreshold) {
                allMatches.push({
                    similarity,
                    clusterValue: embedding.clusterValue,
                    clusterName: embedding.clusterName,
                });
            }
        }
        // sort (highest similarity first)
        allMatches.sort((a, b) => b.similarity - a.similarity);
        return allMatches.length > 0
            ? allMatches[0].clusterName
            : null;
    }
}
