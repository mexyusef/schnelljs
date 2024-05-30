import { executeStandardCall } from "../executeStandardCall.js";
export async function generateSpeech({ model, text, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "generate-speech",
        input: text,
        model,
        options,
        generateResponse: async (options) => {
            const response = await model.doGenerateSpeechStandard(text, options);
            return {
                rawResponse: response,
                extractedValue: response,
            };
        },
    });
    return fullResponse
        ? {
            speech: callResponse.value,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
