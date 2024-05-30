import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { AbstractOpenAICompletionModel, AbstractOpenAICompletionModelSettings } from "../openai/AbstractOpenAICompletionModel.js";
import { OpenAICompatibleProviderName } from "./OpenAICompatibleProviderName.js";
export interface OpenAICompatibleCompletionModelSettings extends AbstractOpenAICompletionModelSettings {
    provider?: OpenAICompatibleProviderName;
}
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's completion API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 */
export declare class OpenAICompatibleCompletionModel extends AbstractOpenAICompletionModel<OpenAICompatibleCompletionModelSettings> implements TextStreamingModel<string, OpenAICompatibleCompletionModelSettings> {
    constructor(settings: OpenAICompatibleCompletionModelSettings);
    get provider(): OpenAICompatibleProviderName;
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get settingsForEvent(): Partial<OpenAICompatibleCompletionModelSettings>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, OpenAICompatibleCompletionModelSettings, this>;
    withSettings(additionalSettings: Partial<OpenAICompatibleCompletionModelSettings>): this;
}
