import { embed } from "../model-function/embed/embed.js";
export class VectorIndexRetriever {
    constructor({ vectorIndex, embeddingModel, maxResults, similarityThreshold, filter, }) {
        Object.defineProperty(this, "vectorIndex", {
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
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.vectorIndex = vectorIndex;
        this.embeddingModel = embeddingModel;
        this.settings = {
            maxResults,
            similarityThreshold,
            filter,
        };
    }
    async retrieve(query, options) {
        const embedding = await embed({
            model: this.embeddingModel,
            value: query,
            ...options,
        });
        const queryResult = await this.vectorIndex.queryByVector({
            queryVector: embedding,
            maxResults: this.settings.maxResults ?? 1,
            similarityThreshold: this.settings.similarityThreshold,
            filter: this.settings?.filter,
        });
        return queryResult.map((item) => item.data);
    }
    withSettings(additionalSettings) {
        return new VectorIndexRetriever(Object.assign({}, this.settings, additionalSettings, {
            vectorIndex: this.vectorIndex,
            embeddingModel: this.embeddingModel,
        }));
    }
}
