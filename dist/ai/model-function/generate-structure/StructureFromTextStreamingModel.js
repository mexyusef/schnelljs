import { streamText } from "../../model-function/generate-text/streamText.js";
import { AsyncQueue } from "../../util/AsyncQueue.js";
import { StructureFromTextGenerationModel } from "./StructureFromTextGenerationModel.js";
import { parsePartialJson } from "./parsePartialJson.js";
export class StructureFromTextStreamingModel extends StructureFromTextGenerationModel {
    constructor(options) {
        super(options);
    }
    async doStreamStructure(schema, prompt, options) {
        const textStream = await streamText({
            model: this.model,
            prompt: this.template.createPrompt(prompt, schema),
            ...options,
        });
        const queue = new AsyncQueue();
        // run async on purpose:
        (async () => {
            try {
                for await (const deltaText of textStream) {
                    queue.push({ type: "delta", deltaValue: deltaText });
                }
            }
            catch (error) {
                queue.push({ type: "error", error });
            }
            finally {
                queue.close();
            }
        })();
        return queue;
    }
    extractStructureTextDelta(delta) {
        return delta;
    }
    parseAccumulatedStructureText(accumulatedText) {
        return parsePartialJson(accumulatedText);
    }
    withSettings(additionalSettings) {
        return new StructureFromTextStreamingModel({
            model: this.model.withSettings(additionalSettings),
            template: this.template,
        });
    }
}
