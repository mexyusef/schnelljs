import { generateText } from "../../model-function/generate-text/generateText.js";
import { ToolCallsParseError } from "./ToolCallsParseError.js";
export class TextGenerationToolCallsModel {
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
    async doGenerateToolCalls(tools, prompt, options) {
        const { rawResponse, text: generatedText, metadata, } = await generateText({
            model: this.model,
            prompt: this.template.createPrompt(prompt, tools),
            fullResponse: true,
            ...options,
        });
        try {
            const { text, toolCalls } = this.template.extractToolCallsAndText(generatedText);
            return {
                rawResponse,
                text,
                toolCalls,
                usage: metadata?.usage,
            };
        }
        catch (error) {
            throw new ToolCallsParseError({
                valueText: generatedText,
                cause: error,
            });
        }
    }
    withSettings(additionalSettings) {
        return new TextGenerationToolCallsModel({
            model: this.model.withSettings(additionalSettings),
            template: this.template,
        });
    }
}
