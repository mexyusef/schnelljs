import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { StructureFromTextPromptTemplate } from "../generate-structure/StructureFromTextPromptTemplate.js";
import { StructureFromTextStreamingModel } from "../generate-structure/StructureFromTextStreamingModel.js";
import { PromptTemplateTextGenerationModel } from "./PromptTemplateTextGenerationModel.js";
import { TextGenerationModelSettings, TextStreamingModel } from "./TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "./TextGenerationPromptTemplate.js";
export declare class PromptTemplateTextStreamingModel<PROMPT, MODEL_PROMPT, SETTINGS extends TextGenerationModelSettings, MODEL extends TextStreamingModel<MODEL_PROMPT, SETTINGS>> extends PromptTemplateTextGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS, MODEL> implements TextStreamingModel<PROMPT, SETTINGS> {
    constructor(options: {
        model: MODEL;
        promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    doStreamText(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<AsyncIterable<import("../Delta.js").Delta<unknown>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asStructureGenerationModel<INPUT_PROMPT>(promptTemplate: StructureFromTextPromptTemplate<INPUT_PROMPT, PROMPT>): StructureFromTextStreamingModel<INPUT_PROMPT, PROMPT, this>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, PROMPT>): PromptTemplateTextStreamingModel<INPUT_PROMPT, PROMPT, SETTINGS, this>;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}
