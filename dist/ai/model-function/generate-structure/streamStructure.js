import { isDeepEqualData } from "../../util/isDeepEqualData.js";
import { executeStreamCall } from "../executeStreamCall.js";
export async function streamStructure({ model, schema, prompt, fullResponse, ...options }) {
    // Note: PROMPT must not be a function.
    const expandedPrompt = typeof prompt === "function"
        ? prompt(schema)
        : prompt;
    let accumulatedText = "";
    let lastStructure;
    const callResponse = await executeStreamCall({
        functionType: "stream-structure",
        input: {
            schema,
            prompt: expandedPrompt,
        },
        model,
        options,
        startStream: async (options) => model.doStreamStructure(schema, expandedPrompt, options),
        processDelta: (delta) => {
            const textDelta = model.extractStructureTextDelta(delta.deltaValue);
            if (textDelta == null) {
                return undefined;
            }
            accumulatedText += textDelta;
            const latestStructure = model.parseAccumulatedStructureText(accumulatedText);
            // only send a new part into the stream when the partial structure has changed:
            if (!isDeepEqualData(lastStructure, latestStructure)) {
                lastStructure = latestStructure;
                return {
                    isComplete: false,
                    value: lastStructure,
                };
            }
            return undefined;
        },
        processFinished: () => {
            // process the final result (full type validation):
            const parseResult = schema.validate(lastStructure);
            if (!parseResult.success) {
                reportError(parseResult.error);
                throw parseResult.error;
            }
            return {
                isComplete: true,
                value: parseResult.data,
            };
        },
    });
    return fullResponse
        ? {
            structureStream: callResponse.value,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
