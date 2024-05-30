import { AsyncQueue } from "../../util/AsyncQueue.js";
import { executeStreamCall } from "../executeStreamCall.js";
export async function streamSpeech({ model, text, fullResponse, ...options }) {
    let textStream;
    // simulate a stream with a single value for a string input:
    if (typeof text === "string") {
        const queue = new AsyncQueue();
        queue.push(text);
        queue.close();
        textStream = queue;
    }
    else {
        textStream = text;
    }
    const callResponse = await executeStreamCall({
        functionType: "stream-speech",
        input: text,
        model,
        options,
        startStream: async (options) => model.doGenerateSpeechStreamDuplex(textStream, options),
        processDelta: (delta) => delta.deltaValue,
    });
    return fullResponse
        ? {
            speechStream: callResponse.value,
            metadata: callResponse.metadata,
        }
        : callResponse.value;
}
