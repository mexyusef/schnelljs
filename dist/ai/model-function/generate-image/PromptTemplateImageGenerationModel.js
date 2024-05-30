export class PromptTemplateImageGenerationModel {
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
    doGenerateImages(prompt, options) {
        const mappedPrompt = this.promptTemplate.format(prompt);
        return this.model.doGenerateImages(mappedPrompt, options);
    }
    get settingsForEvent() {
        return this.model.settingsForEvent;
    }
    withPromptTemplate(promptTemplate) {
        return new PromptTemplateImageGenerationModel({ model: this, promptTemplate });
    }
    withSettings(additionalSettings) {
        return new PromptTemplateImageGenerationModel({
            model: this.model.withSettings(additionalSettings),
            promptTemplate: this.promptTemplate,
        });
    }
}
