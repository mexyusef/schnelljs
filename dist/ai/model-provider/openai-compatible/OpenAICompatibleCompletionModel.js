import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { AbstractOpenAICompletionModel, } from "../openai/AbstractOpenAICompletionModel.js";
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's completion API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 */
export class OpenAICompatibleCompletionModel extends AbstractOpenAICompletionModel {
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
            "suffix",
            "temperature",
            "topP",
            "logprobs",
            "echo",
            "presencePenalty",
            "frequencyPenalty",
            "bestOf",
            "logitBias",
            "seed",
        ];
        return Object.fromEntries(Object.entries(this.settings).filter(([key]) => eventSettingProperties.includes(key)));
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
        return new OpenAICompatibleCompletionModel(Object.assign({}, this.settings, additionalSettings));
    }
}
