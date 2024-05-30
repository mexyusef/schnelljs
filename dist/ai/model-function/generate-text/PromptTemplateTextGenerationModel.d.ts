import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { TextGenerationToolCallModel, ToolCallPromptTemplate } from "../../tool/generate-tool-call/TextGenerationToolCallModel.js";
import { TextGenerationToolCallsModel } from "../../tool/generate-tool-calls/TextGenerationToolCallsModel.js";
import { ToolCallsPromptTemplate } from "../../tool/generate-tool-calls/ToolCallsPromptTemplate.js";
import { StructureFromTextGenerationModel } from "../generate-structure/StructureFromTextGenerationModel.js";
import { StructureFromTextPromptTemplate } from "../generate-structure/StructureFromTextPromptTemplate.js";
import { TextGenerationModel, TextGenerationModelSettings } from "./TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "./TextGenerationPromptTemplate.js";
export declare class PromptTemplateTextGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS extends TextGenerationModelSettings, MODEL extends TextGenerationModel<MODEL_PROMPT, SETTINGS>> implements TextGenerationModel<PROMPT, SETTINGS> {
    readonly model: MODEL;
    readonly promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    constructor({ model, promptTemplate, }: {
        model: MODEL;
        promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    get modelInformation(): import("../ModelInformation.js").ModelInformation;
    get settings(): SETTINGS;
    get tokenizer(): MODEL["tokenizer"];
    get contextWindowSize(): MODEL["contextWindowSize"];
    get countPromptTokens(): MODEL["countPromptTokens"] extends undefined ? undefined : (prompt: PROMPT) => PromiseLike<number>;
    doGenerateTexts(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        textGenerationResults: import("./TextGenerationResult.js").TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: unknown;
        textGenerationResults: import("./TextGenerationResult.js").TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    };
    get settingsForEvent(): Partial<SETTINGS>;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, PROMPT>): TextGenerationToolCallModel<INPUT_PROMPT, PROMPT, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, PROMPT>): TextGenerationToolCallsModel<INPUT_PROMPT, PROMPT, this>;
    asStructureGenerationModel<INPUT_PROMPT>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, PROMPT>): StructureFromTextGenerationModel<INPUT_PROMPT, PROMPT, this>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, PROMPT>): PromptTemplateTextGenerationModel<INPUT_PROMPT, PROMPT, SETTINGS, this>;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}
