import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { FlexibleStructureFromTextPromptTemplate, StructureFromTextPromptTemplate } from "./StructureFromTextPromptTemplate.js";
export declare const jsonStructurePrompt: {
    custom<SOURCE_PROMPT, TARGET_PROMPT>(createPrompt: (prompt: SOURCE_PROMPT, schema: Schema<unknown> & JsonSchemaProducer) => TARGET_PROMPT): StructureFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    text({ schemaPrefix, schemaSuffix, }?: {
        schemaPrefix?: string | undefined;
        schemaSuffix?: string | undefined;
    }): FlexibleStructureFromTextPromptTemplate<string, InstructionPrompt>;
    instruction({ schemaPrefix, schemaSuffix, }?: {
        schemaPrefix?: string | undefined;
        schemaSuffix?: string | undefined;
    }): FlexibleStructureFromTextPromptTemplate<InstructionPrompt, InstructionPrompt>;
};
