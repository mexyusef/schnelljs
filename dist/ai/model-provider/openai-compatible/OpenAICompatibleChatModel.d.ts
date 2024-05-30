import { FlexibleStructureFromTextPromptTemplate, StructureFromTextPromptTemplate } from "../../model-function/generate-structure/StructureFromTextPromptTemplate.js";
import { StructureFromTextStreamingModel } from "../../model-function/generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateFullTextModel } from "../../model-function/generate-text/PromptTemplateFullTextModel.js";
import { TextStreamingModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
import { ToolCallGenerationModel } from "../../tool/generate-tool-call/ToolCallGenerationModel.js";
import { ToolCallsGenerationModel } from "../../tool/generate-tool-calls/ToolCallsGenerationModel.js";
import { AbstractOpenAIChatModel, AbstractOpenAIChatSettings, OpenAIChatPrompt } from "../openai/AbstractOpenAIChatModel.js";
import { OpenAICompatibleProviderName } from "./OpenAICompatibleProviderName.js";
export interface OpenAICompatibleChatSettings extends AbstractOpenAIChatSettings {
    provider?: OpenAICompatibleProviderName;
}
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's chat API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export declare class OpenAICompatibleChatModel extends AbstractOpenAIChatModel<OpenAICompatibleChatSettings> implements TextStreamingModel<OpenAIChatPrompt, OpenAICompatibleChatSettings>, ToolCallGenerationModel<OpenAIChatPrompt, OpenAICompatibleChatSettings>, ToolCallsGenerationModel<OpenAIChatPrompt, OpenAICompatibleChatSettings> {
    constructor(settings: OpenAICompatibleChatSettings);
    get provider(): OpenAICompatibleProviderName;
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get settingsForEvent(): Partial<OpenAICompatibleChatSettings>;
    asStructureGenerationModel<INPUT_PROMPT, OpenAIChatPrompt>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt> | FlexibleStructureFromTextPromptTemplate<INPUT_PROMPT, unknown>): StructureFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>> | StructureFromTextStreamingModel<INPUT_PROMPT, OpenAIChatPrompt, TextStreamingModel<OpenAIChatPrompt, import("../../model-function/generate-text/TextGenerationModel.js").TextGenerationModelSettings>>;
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): PromptTemplateFullTextModel<string, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): PromptTemplateFullTextModel<import("../../index.js").InstructionPrompt, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): PromptTemplateFullTextModel<import("../../index.js").ChatPrompt, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt>): PromptTemplateFullTextModel<INPUT_PROMPT, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OpenAICompatibleChatSettings>): this;
}
