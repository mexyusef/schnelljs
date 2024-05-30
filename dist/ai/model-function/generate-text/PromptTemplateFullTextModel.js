import { PromptTemplateTextStreamingModel } from "./PromptTemplateTextStreamingModel.js";
export class PromptTemplateFullTextModel extends PromptTemplateTextStreamingModel {
    constructor(options) {
        super(options);
    }
    doGenerateToolCall(tool, prompt, options) {
        const mappedPrompt = this.promptTemplate.format(prompt);
        return this.model.doGenerateToolCall(tool, mappedPrompt, options);
    }
    doGenerateToolCalls(tools, prompt, options) {
        const mappedPrompt = this.promptTemplate.format(prompt);
        return this.model.doGenerateToolCalls(tools, mappedPrompt, options);
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateFullTextModel({
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
        return new PromptTemplateFullTextModel({
            model: this.model.withSettings(additionalSettings),
            promptTemplate: this.promptTemplate,
        });
    }
}
