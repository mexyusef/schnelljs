import { TextGenerationToolCallModel, } from "../../tool/generate-tool-call/TextGenerationToolCallModel.js";
import { TextGenerationToolCallsModel } from "../../tool/generate-tool-calls/TextGenerationToolCallsModel.js";
import { StructureFromTextGenerationModel } from "../generate-structure/StructureFromTextGenerationModel.js";
export class PromptTemplateTextGenerationModel {
    constructor({ model, promptTemplate, }) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "promptTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = model;
        this.promptTemplate = promptTemplate;
    }
    get modelInformation() {
        return this.model.modelInformation;
    }
    get settings() {
        return this.model.settings;
    }
    get tokenizer() {
        return this.model.tokenizer;
    }
    get contextWindowSize() {
        return this.model.contextWindowSize;
    }
    get countPromptTokens() {
        const originalCountPromptTokens = this.model.countPromptTokens?.bind(this.model);
        if (originalCountPromptTokens === undefined) {
            return undefined;
        }
        return ((prompt) => originalCountPromptTokens(this.promptTemplate.format(prompt)));
    }
    doGenerateTexts(prompt, options) {
        const mappedPrompt = this.promptTemplate.format(prompt);
        return this.model.doGenerateTexts(mappedPrompt, options);
    }
    restoreGeneratedTexts(rawResponse) {
        return this.model.restoreGeneratedTexts(rawResponse);
    }
    get settingsForEvent() {
        return this.model.settingsForEvent;
    }
    asToolCallGenerationModel(promptTemplate) {
        return new TextGenerationToolCallModel({
            model: this,
            format: promptTemplate,
        });
    }
    asToolCallsOrTextGenerationModel(promptTemplate) {
        return new TextGenerationToolCallsModel({
            model: this,
            template: promptTemplate,
        });
    }
    asStructureGenerationModel(promptTemplate) {
        return new StructureFromTextGenerationModel({
            model: this,
            template: promptTemplate,
        });
    }
    withJsonOutput(schema) {
        return new PromptTemplateTextGenerationModel({
            model: this.model.withJsonOutput(schema),
            promptTemplate: this.promptTemplate,
        });
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateTextGenerationModel({
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
        return new PromptTemplateTextGenerationModel({
            model: this.model.withSettings(additionalSettings),
            promptTemplate: this.promptTemplate,
        });
    }
}
