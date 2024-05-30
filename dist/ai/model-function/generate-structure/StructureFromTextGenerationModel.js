import { generateText } from "../generate-text/generateText.js";
import { StructureParseError } from "./StructureParseError.js";
export class StructureFromTextGenerationModel {
    constructor({ model, template, }) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = model;
        this.template = template;
    }
    get modelInformation() {
        return this.model.modelInformation;
    }
    get settings() {
        return this.model.settings;
    }
    get settingsForEvent() {
        return this.model.settingsForEvent;
    }
    getModelWithJsonOutput(schema) {
        if (this.template.withJsonOutput != null) {
            return this.template.withJsonOutput?.({
                model: this.model,
                schema,
            });
        }
        return this.model;
    }
    async doGenerateStructure(schema, prompt, options) {
        const { rawResponse, text } = await generateText({
            model: this.model,
            prompt: this.template.createPrompt(prompt, schema),
            fullResponse: true,
            ...options,
        });
        try {
            return {
                rawResponse,
                value: this.template.extractStructure(text),
                valueText: text,
            };
        }
        catch (error) {
            throw new StructureParseError({
                valueText: text,
                cause: error,
            });
        }
    }
    withSettings(additionalSettings) {
        return new StructureFromTextGenerationModel({
            model: this.model.withSettings(additionalSettings),
            template: this.template,
        });
    }
}
