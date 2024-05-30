import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { textGenerationModelProperties, } from "../../model-function/generate-text/TextGenerationModel.js";
import { chat, instruction, } from "../../model-function/generate-text/prompt-template/TextPromptTemplate.js";
import { countTokens } from "../../model-function/tokenize-text/countTokens.js";
import { AbstractOpenAICompletionModel, } from "./AbstractOpenAICompletionModel.js";
import { TikTokenTokenizer } from "./TikTokenTokenizer.js";
/**
 * @see https://platform.openai.com/docs/models/
 * @see https://openai.com/pricing
 */
export const OPENAI_TEXT_GENERATION_MODELS = {
    "gpt-3.5-turbo-instruct": {
        contextWindowSize: 4097,
        promptTokenCostInMillicents: 0.15,
        completionTokenCostInMillicents: 0.2,
    },
};
export function getOpenAICompletionModelInformation(model) {
    return OPENAI_TEXT_GENERATION_MODELS[model];
}
export const isOpenAICompletionModel = (model) => model in OPENAI_TEXT_GENERATION_MODELS;
export const calculateOpenAICompletionCostInMillicents = ({ model, response, }) => {
    const modelInformation = getOpenAICompletionModelInformation(model);
    return (response.usage.prompt_tokens *
        modelInformation.promptTokenCostInMillicents +
        response.usage.completion_tokens *
            modelInformation.completionTokenCostInMillicents);
};
/**
 * Create a text generation model that calls the OpenAI text completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 *
 * @example
 * const model = new OpenAICompletionModel({
 *   model: "gpt-3.5-turbo-instruct",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
export class OpenAICompletionModel extends AbstractOpenAICompletionModel {
    constructor(settings) {
        super(settings);
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "openai"
        });
        Object.defineProperty(this, "contextWindowSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const modelInformation = getOpenAICompletionModelInformation(this.settings.model);
        this.tokenizer = new TikTokenTokenizer({
            model: this.settings.model,
        });
        this.contextWindowSize = modelInformation.contextWindowSize;
    }
    get modelName() {
        return this.settings.model;
    }
    async countPromptTokens(input) {
        return countTokens(this.tokenizer, input);
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
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt() {
        return this.withPromptTemplate(instruction());
    }
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(options) {
        return this.withPromptTemplate(chat(options));
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
        return new OpenAICompletionModel(Object.assign({}, this.settings, additionalSettings));
    }
}
