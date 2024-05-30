import { executeStandardCall } from "../executeStandardCall.js";
export async function generateText({ model, prompt, fullResponse, ...options }) {
    const callResponse = await executeStandardCall({
        functionType: "generate-text",
        input: prompt,
        model,
        options,
        generateResponse: async (options) => {
            async function getGeneratedTexts() {
                if (options?.cache == null) {
                    return {
                        ...(await model.doGenerateTexts(prompt, options)),
                        cache: undefined,
                    };
                }
                let cacheErrors = undefined;
                const cacheKey = {
                    functionType: "generate-text",
                    functionId: options?.functionId,
                    input: {
                        model,
                        settings: model.settingsForEvent, // TODO should include full model information
                        prompt,
                    },
                };
                try {
                    const cachedRawResponse = await options.cache.lookupValue(cacheKey);
                    if (cachedRawResponse != null) {
                        return {
                            ...model.restoreGeneratedTexts(cachedRawResponse),
                            cache: { status: "hit" },
                        };
                    }
                }
                catch (err) {
                    cacheErrors = [err];
                }
                const result = await model.doGenerateTexts(prompt, options);
                try {
                    await options.cache.storeValue(cacheKey, result.rawResponse);
                }
                catch (err) {
                    cacheErrors = [...(cacheErrors ?? []), err];
                }
                return {
                    ...result,
                    cache: { status: "miss", errors: cacheErrors },
                };
            }
            const result = await getGeneratedTexts();
            const shouldTrimWhitespace = model.settings.trimWhitespace ?? true;
            const textGenerationResults = shouldTrimWhitespace
                ? result.textGenerationResults.map((textGeneration) => ({
                    text: textGeneration.text.trim(),
                    finishReason: textGeneration.finishReason,
                }))
                : result.textGenerationResults;
            // TODO add cache information
            return {
                rawResponse: result.rawResponse,
                extractedValue: textGenerationResults,
                usage: result.usage,
            };
        },
    });
    const textGenerationResults = callResponse.value;
    const firstResult = textGenerationResults[0];
    return fullResponse
        ? {
            text: firstResult.text,
            finishReason: firstResult.finishReason,
            texts: textGenerationResults.map((textGeneration) => textGeneration.text),
            textGenerationResults,
            rawResponse: callResponse.rawResponse,
            metadata: callResponse.metadata,
        }
        : firstResult.text;
}
