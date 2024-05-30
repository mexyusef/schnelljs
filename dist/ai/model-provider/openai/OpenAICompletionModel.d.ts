import { PromptTemplateTextStreamingModel } from "../../model-function/generate-text/PromptTemplateTextStreamingModel.js";
import { TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { AbstractOpenAICompletionModel, AbstractOpenAICompletionModelSettings, OpenAICompletionResponse } from "./AbstractOpenAICompletionModel.js";
import { TikTokenTokenizer } from "./TikTokenTokenizer.js";
/**
 * @see https://platform.openai.com/docs/models/
 * @see https://openai.com/pricing
 */
export declare const OPENAI_TEXT_GENERATION_MODELS: {
    "gpt-3.5-turbo-instruct": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
};
export declare function getOpenAICompletionModelInformation(model: OpenAICompletionModelType): {
    contextWindowSize: number;
    promptTokenCostInMillicents: number;
    completionTokenCostInMillicents: number;
};
export type OpenAICompletionModelType = keyof typeof OPENAI_TEXT_GENERATION_MODELS;
export declare const isOpenAICompletionModel: (model: string) => model is "gpt-3.5-turbo-instruct";
export declare const calculateOpenAICompletionCostInMillicents: ({ model, response, }: {
    model: OpenAICompletionModelType;
    response: OpenAICompletionResponse;
}) => number;
export interface OpenAICompletionModelSettings extends AbstractOpenAICompletionModelSettings {
    model: OpenAICompletionModelType;
}
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
export declare class OpenAICompletionModel extends AbstractOpenAICompletionModel<OpenAICompletionModelSettings> implements TextStreamingModel<string, OpenAICompletionModelSettings> {
    constructor(settings: OpenAICompletionModelSettings);
    readonly provider: "openai";
    get modelName(): "gpt-3.5-turbo-instruct";
    readonly contextWindowSize: number;
    readonly tokenizer: TikTokenTokenizer;
    countPromptTokens(input: string): Promise<number>;
    get settingsForEvent(): Partial<OpenAICompletionModelSettings>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateTextStreamingModel<import("../../index.js").InstructionPrompt, string, OpenAICompletionModelSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(options?: {
        user?: string;
        assistant?: string;
    }): PromptTemplateTextStreamingModel<import("../../index.js").ChatPrompt, string, OpenAICompletionModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, OpenAICompletionModelSettings, this>;
    withSettings(additionalSettings: Partial<OpenAICompletionModelSettings>): this;
}
