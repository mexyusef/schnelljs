import { generateText } from "../../model-function/generate-text/generateText.js";
import { ToolCallParseError } from "./ToolCallParseError.js";
export class TextGenerationToolCallModel {
    constructor({ model, format, }) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "format", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = model;
        this.format = format;
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
    async doGenerateToolCall(tool, prompt, options) {
        const { rawResponse, text, metadata } = await generateText({
            model: this.model,
            prompt: this.format.createPrompt(prompt, tool),
            fullResponse: true,
            ...options,
        });
        try {
            return {
                rawResponse,
                toolCall: this.format.extractToolCall(text, tool),
                usage: metadata?.usage,
            };
        }
        catch (error) {
            throw new ToolCallParseError({
                toolName: tool.name,
                valueText: text,
                cause: error,
            });
        }
    }
    withSettings(additionalSettings) {
        return new TextGenerationToolCallModel({
            model: this.model.withSettings(additionalSettings),
            format: this.format,
        });
    }
}
