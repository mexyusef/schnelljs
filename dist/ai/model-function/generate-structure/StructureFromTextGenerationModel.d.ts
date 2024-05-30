import { FunctionOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { TextGenerationModel, TextGenerationModelSettings } from "../generate-text/TextGenerationModel.js";
import { StructureFromTextPromptTemplate } from "./StructureFromTextPromptTemplate.js";
import { StructureGenerationModel } from "./StructureGenerationModel.js";
export declare class StructureFromTextGenerationModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, TextGenerationModelSettings>> implements StructureGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    protected readonly model: MODEL;
    protected readonly template: StructureFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    constructor({ model, template, }: {
        model: MODEL;
        template: StructureFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): import("../ModelInformation.js").ModelInformation;
    get settings(): TextGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    getModelWithJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): MODEL;
    doGenerateStructure(schema: Schema<unknown> & JsonSchemaProducer, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        value: unknown;
        valueText: string;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}
