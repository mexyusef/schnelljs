import { executeStreamCall } from "../executeStreamCall.js";
export async function streamText({ model, prompt, fullResponse, ...options }) {
    const shouldTrimWhitespace = model.settings.trimWhitespace ?? true;
    let accumulatedText = "";
    let isFirstDelta = true;
    let trailingWhitespace = "";
    let resolveText;
    const textPromise = new Promise((resolve) => {
        resolveText = resolve;
    });
    const callResponse = await executeStreamCall({
        functionType: "stream-text",
        input: prompt,
        model,
        options,
        startStream: async (options) => model.doStreamText(prompt, options),
        processDelta: (delta) => {
            let textDelta = model.extractTextDelta(delta.deltaValue);
            if (textDelta == null || textDelta.length === 0) {
                return undefined;
            }
            if (shouldTrimWhitespace) {
                textDelta = isFirstDelta
                    ? // remove leading whitespace:
                        textDelta.trimStart()
                    : // restore trailing whitespace from previous chunk:
                        trailingWhitespace + textDelta;
                // trim trailing whitespace and store it for the next chunk:
                const trailingWhitespaceMatch = textDelta.match(/\s+$/);
                trailingWhitespace = trailingWhitespaceMatch
                    ? trailingWhitespaceMatch[0]
                    : "";
                textDelta = textDelta.trimEnd();
            }
            isFirstDelta = false;
            accumulatedText += textDelta;
            return textDelta;
        },
        onDone: () => {
            resolveText(accumulatedText);
        },
    });
    return fullResponse
        ? {
            textStream: callResponse.value,
            text: textPromise,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
