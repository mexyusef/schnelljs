import { executeStandardCall } from "../executeStandardCall.js";
import { StructureValidationError } from "./StructureValidationError.js";
export async function generateStructure({ model, schema, prompt, fullResponse, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(schema)
        : prompt;
    const callResponse = await executeStandardCall({
        functionType: "generate-structure",
        input: {
            schema,
            prompt: expandedPrompt,
        },
        model,
        options,
        generateResponse: async (options) => {
            const result = await model.doGenerateStructure(schema, expandedPrompt, options);
            const structure = result.value;
            const parseResult = schema.validate(structure);
            if (!parseResult.success) {
                throw new StructureValidationError({
                    valueText: result.valueText,
                    value: structure,
                    cause: parseResult.error,
                });
            }
            const value = parseResult.data;
            return {
                rawResponse: result.rawResponse,
                extractedValue: value,
                usage: result.usage,
            };
        },
    });
    return fullResponse
        ? {
            structure: callResponse.value,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
