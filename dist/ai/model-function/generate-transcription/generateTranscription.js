import { executeStandardCall } from "../executeStandardCall.js";
export async function generateTranscription({ model, data, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "generate-transcription",
        input: data,
        model,
        options,
        generateResponse: async (options) => {
            const result = await model.doTranscribe(data, options);
            return {
                rawResponse: result.rawResponse,
                extractedValue: result.transcription,
            };
        },
    });
    return fullResponse ? callResponse : callResponse.value;
}
