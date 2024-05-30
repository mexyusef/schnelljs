import { StructureFromTextStreamingModel } from "../generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextGenerationModel } from "./PromptTemplateTextGenerationModel.js";
export class PromptTemplateTextStreamingModel extends PromptTemplateTextGenerationModel {
    constructor(options) {
        super(options);
    }
    doStreamText(prompt, options) {
        const mappedPrompt = this.promptTemplate.format(prompt);
        return this.model.doStreamText(mappedPrompt, options);
    }
    extractTextDelta(delta) {
        return this.model.extractTextDelta(delta);
    }
    asStructureGenerationModel(promptTemplate) {
        return new StructureFromTextStreamingModel({
            model: this,
            template: promptTemplate,
        });
    }
    withJsonOutput(schema) {
        return new PromptTemplateTextStreamingModel({
            model: this.model.withJsonOutput(schema),
            promptTemplate: this.promptTemplate,
        });
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateTextStreamingModel({
            model: this.withSettings({
                stopSequences: [
                    ...(this.settings.stopSequences ?? []),
                    ...promptTemplate.stopSequences,
                ],
            }),
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new PromptTemplateTextStreamingModel({
            model: this.model.withSettings(additionalSettings),
            promptTemplate: this.promptTemplate,
        });
    }
}
