import { executeStandardCall } from "../executeStandardCall.js";
export async function generateImage({ model, prompt, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "generate-image",
        input: prompt,
        model,
        options,
        generateResponse: async (options) => {
            const result = await model.doGenerateImages(prompt, options);
            return {
                rawResponse: result.rawResponse,
                extractedValue: result.base64Images,
            };
        },
    });
    const imagesBase64 = callResponse.value;
    const images = imagesBase64.map((imageBase64) => Buffer.from(imageBase64, "base64"));
    return fullResponse
        ? {
            image: images[0],
            imageBase64: imagesBase64[0],
            images,
            imagesBase64,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : images[0];
}
