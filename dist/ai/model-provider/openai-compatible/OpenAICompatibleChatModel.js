import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateFullTextModel } from "../../model-function/generate-text/PromptTemplateFullTextModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { AbstractOpenAIChatModel, } from "../openai/AbstractOpenAIChatModel.js";
import { chat, instruction, text } from "../openai/OpenAIChatPromptTemplate.js";
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's chat API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export class OpenAICompatibleChatModel extends AbstractOpenAIChatModel {
    constructor(settings) {
        super(settings);
        Object.defineProperty(this, "contextWindowSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "countPromptTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
    }
    get provider() {
        return this.settings.provider ?? "openaicompatible";
    }
    get modelName() {
        return this.settings.model;
    }
    get settingsForEvent() {
        const eventSettingProperties = [
            ...textGenerationModelProperties,
            "functions",
            "functionCall",
            "temperature",
            "topP",
            "presencePenalty",
            "frequencyPenalty",
            "logitBias",
            "seed",
            "responseFormat",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
    }
    asStructureGenerationModel(promptTemplate) {
        return "adaptModel" in promptTemplate
            ? new StructureFromTextStreamingModel({
                model: promptTemplate.adaptModel(this),
                template: promptTemplate,
            })
            : new StructureFromTextStreamingModel({
                model: this,
                template: promptTemplate,
            });
    }
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt() {
        return this.withPromptTemplate(text());
    }
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt() {
        return this.withPromptTemplate(instruction());
    }
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt() {
        return this.withPromptTemplate(chat());
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
    withJsonOutput() {
        return this.withSettings({ responseFormat: { type: "json_object" } });
    }
    withSettings(additionalSettings) {
        return new OpenAICompatibleChatModel(Object.assign({}, this.settings, additionalSettings));
    }
}
