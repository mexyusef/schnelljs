import { FlexibleStructureFromTextPromptTemplate, StructureFromTextPromptTemplate } from "../../model-function/generate-structure/StructureFromTextPromptTemplate.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateFullTextModel } from "../../model-function/generate-text/PromptTemplateFullTextModel.js";
import { TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ToolCallGenerationModel } from "../../tool/generate-tool-call/ToolCallGenerationModel.js";
import { ToolCallsGenerationModel } from "../../tool/generate-tool-calls/ToolCallsGenerationModel.js";
import { AbstractOpenAIChatModel, AbstractOpenAIChatSettings, OpenAIChatPrompt, OpenAIChatResponse } from "./AbstractOpenAIChatModel.js";
import { OpenAIChatFunctionCallStructureGenerationModel } from "./OpenAIChatFunctionCallStructureGenerationModel.js";
import { TikTokenTokenizer } from "./TikTokenTokenizer.js";
export declare const OPENAI_CHAT_MODELS: {
    "gpt-4": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-0314": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-0613": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
        fineTunedPromptTokenCostInMillicents: null;
        fineTunedCompletionTokenCostInMillicents: null;
    };
    "gpt-4-1106-preview": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-vision-preview": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-32k": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-32k-0314": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-4-32k-0613": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
        fineTunedPromptTokenCostInMillicents: number;
        fineTunedCompletionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo-1106": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo-0301": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo-0613": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
        fineTunedPromptTokenCostInMillicents: number;
        fineTunedCompletionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo-16k": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
    "gpt-3.5-turbo-16k-0613": {
        contextWindowSize: number;
        promptTokenCostInMillicents: number;
        completionTokenCostInMillicents: number;
    };
};
export declare function getOpenAIChatModelInformation(model: OpenAIChatModelType): {
    baseModel: OpenAIChatBaseModelType;
    isFineTuned: boolean;
    contextWindowSize: number;
    promptTokenCostInMillicents: number | null;
    completionTokenCostInMillicents: number | null;
};
type FineTuneableOpenAIChatModelType = `gpt-3.5-turbo` | `gpt-3.5-turbo-0613` | `gpt-4-0613`;
type FineTunedOpenAIChatModelType = `ft:${FineTuneableOpenAIChatModelType}:${string}:${string}:${string}`;
export type OpenAIChatBaseModelType = keyof typeof OPENAI_CHAT_MODELS;
export type OpenAIChatModelType = OpenAIChatBaseModelType | FineTunedOpenAIChatModelType;
export declare const isOpenAIChatModel: (model: string) => model is OpenAIChatModelType;
export declare const calculateOpenAIChatCostInMillicents: ({ model, response, }: {
    model: OpenAIChatModelType;
    response: OpenAIChatResponse;
}) => number | null;
export interface OpenAIChatSettings extends AbstractOpenAIChatSettings {
    model: OpenAIChatModelType;
}
/**
 * Create a text generation model that calls the OpenAI chat API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * const model = new OpenAIChatModel({
 *   model: "gpt-3.5-turbo",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText([
 *   model,
 *   openai.ChatMessage.system(
 *     "Write a short story about a robot learning to love:"
 *   ),
 * ]);
 */
export declare class OpenAIChatModel extends AbstractOpenAIChatModel<OpenAIChatSettings> implements TextStreamingModel<OpenAIChatPrompt, OpenAIChatSettings>, ToolCallGenerationModel<OpenAIChatPrompt, OpenAIChatSettings>, ToolCallsGenerationModel<OpenAIChatPrompt, OpenAIChatSettings> {
    constructor(settings: OpenAIChatSettings);
    readonly provider: "openai";
    get modelName(): OpenAIChatModelType;
    readonly contextWindowSize: number;
    readonly tokenizer: TikTokenTokenizer;
    /**
     * Counts the prompt tokens required for the messages. This includes the message base tokens
     * and the prompt base tokens.
     */
    countPromptTokens(messages: OpenAIChatPrompt): Promise<number>;
    get settingsForEvent(): Partial<OpenAIChatSettings>;
    asFunctionCallStructureGenerationModel({ fnName, fnDescription, }: {
        fnName: string;
        fnDescription?: string;
    }): OpenAIChatFunctionCallStructureGenerationModel<TextGenerationPromptTemplate<OpenAIChatPrompt, OpenAIChatPrompt>>;
    asStructureGenerationModel<INPUT_PROMPT, OpenAIChatPrompt>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt> | FlexibleStructureFromTextPromptTemplate<INPUT_PROMPT, unknown>): StructureFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>> | StructureFromTextStreamingModel<INPUT_PROMPT, OpenAIChatPrompt, TextStreamingModel<OpenAIChatPrompt, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>>;
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): PromptTemplateFullTextModel<string, OpenAIChatPrompt, OpenAIChatSettings, this>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateFullTextModel<import("../../index.js").InstructionPrompt, OpenAIChatPrompt, OpenAIChatSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): PromptTemplateFullTextModel<import("../../index.js").ChatPrompt, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt>): PromptTemplateFullTextModel<INPUT_PROMPT, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OpenAIChatSettings>): this;
}
export {};
