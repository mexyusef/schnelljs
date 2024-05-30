import { executeStandardCall } from "../executeStandardCall.js";
export async function embedMany({ model, values, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "embed",
        input: values,
        model,
        options,
        generateResponse: async (options) => {
            // split the values into groups that are small enough to be sent in one call:
            const maxValuesPerCall = model.maxValuesPerCall;
            const valueGroups = [];
            if (maxValuesPerCall == null) {
                valueGroups.push(values);
            }
            else {
                for (let i = 0; i < values.length; i += maxValuesPerCall) {
                    valueGroups.push(values.slice(i, i + maxValuesPerCall));
                }
            }
            // call the model for each group:
            let responses;
            if (model.isParallelizable) {
                responses = await Promise.all(valueGroups.map((valueGroup) => model.doEmbedValues(valueGroup, options)));
            }
            else {
                responses = [];
                for (const valueGroup of valueGroups) {
                    const response = await model.doEmbedValues(valueGroup, options);
                    responses.push(response);
                }
            }
            const rawResponses = responses.map((response) => response.rawResponse);
            const embeddings = [];
            for (const response of responses) {
                embeddings.push(...response.embeddings);
            }
            return {
                rawResponse: rawResponses,
                extractedValue: embeddings,
            };
        },
    });
    return fullResponse
        ? {
            embeddings: callResponse.value,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
export async function embed({ model, value, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "embed",
        input: value,
        model,
        options,
        generateResponse: async (options) => {
            const result = await model.doEmbedValues([value], options);
            return {
                rawResponse: result.rawResponse,
                extractedValue: result.embeddings[0],
            };
        },
    });
    return fullResponse
        ? {
            embedding: callResponse.value,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
