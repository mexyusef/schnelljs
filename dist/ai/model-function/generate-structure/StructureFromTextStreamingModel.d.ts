import { FunctionOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { Delta } from "../../model-function/Delta.js";
import { AsyncQueue } from "../../util/AsyncQueue.js";
import { TextGenerationModelSettings, TextStreamingModel } from "../generate-text/TextGenerationModel.js";
import { StructureFromTextGenerationModel } from "./StructureFromTextGenerationModel.js";
import { StructureFromTextPromptTemplate } from "./StructureFromTextPromptTemplate.js";
import { StructureStreamingModel } from "./StructureGenerationModel.js";
export declare class StructureFromTextStreamingModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextStreamingModel<TARGET_PROMPT, TextGenerationModelSettings>> extends StructureFromTextGenerationModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL> implements StructureStreamingModel<SOURCE_PROMPT, MODEL["settings"]> {
    constructor(options: {
        model: MODEL;
        template: StructureFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    doStreamStructure(schema: Schema<unknown> & JsonSchemaProducer, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<AsyncQueue<Delta<string>>>;
    extractStructureTextDelta(delta: unknown): string;
    parseAccumulatedStructureText(accumulatedText: string): unknown;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}
