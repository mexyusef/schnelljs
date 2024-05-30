import { parseJSON } from "../../core/schema/parseJSON.js";
const DEFAULT_SCHEMA_PREFIX = "JSON schema:";
const DEFAULT_SCHEMA_SUFFIX = "\nYou MUST answer with a JSON object matches the above schema.";
export const jsonStructurePrompt = {
    custom(createPrompt) {
        return { createPrompt, extractStructure };
    },
    text({ schemaPrefix, schemaSuffix, } = {}) {
        return {
            createPrompt: (prompt, schema) => ({
                system: createSystemPrompt({ schema, schemaPrefix, schemaSuffix }),
                instruction: prompt,
            }),
            extractStructure,
            adaptModel: (model) => model.withInstructionPrompt(),
            withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema),
        };
    },
    instruction({ schemaPrefix, schemaSuffix, } = {}) {
        return {
            createPrompt: (prompt, schema) => ({
                system: createSystemPrompt({
                    originalSystemPrompt: prompt.system,
                    schema,
                    schemaPrefix,
                    schemaSuffix,
                }),
                instruction: prompt.instruction,
            }),
            extractStructure,
            adaptModel: (model) => model.withInstructionPrompt(),
            withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema),
        };
    },
};
function createSystemPrompt({ originalSystemPrompt, schema, schemaPrefix = DEFAULT_SCHEMA_PREFIX, schemaSuffix = DEFAULT_SCHEMA_SUFFIX, }) {
    return [
        originalSystemPrompt,
        schemaPrefix,
        JSON.stringify(schema.getJsonSchema()),
        schemaSuffix,
    ]
        .filter(Boolean)
        .join("\n");
}
function extractStructure(response) {
    return parseJSON({ text: response });
}
