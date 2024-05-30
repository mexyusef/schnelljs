/// <reference types="node" />
import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { SpeechGenerationModelSettings, StreamingSpeechGenerationModel } from "./SpeechGenerationModel.js";
/**
 * Stream synthesized speech from text. Also called text-to-speech (TTS).
 * Duplex streaming where both the input and output are streamed is supported.
 *
 * @see https://modelfusion.dev/guide/function/generate-speech
 *
 * @example
 * const textStream = await streamText(...);
 *
 * const speechStream = await streamSpeech({
 *   model: elevenlabs.SpeechGenerator(...),
 *   text: textStream
 * });
 *
 * for await (const speechPart of speechStream) {
 *   // ...
 * }
 *
 * @param {StreamingSpeechGenerationModel<SpeechGenerationModelSettings>} model - The speech generation model.
 * @param {AsyncIterable<string> | string} text - The text to be converted to speech. Can be a string or an async iterable of strings.
 * @param {FunctionOptions} [options] - Optional function options.
 *
 * @returns {AsyncIterableResultPromise<Buffer>} An async iterable promise that contains the synthesized speech chunks.
 */
export declare function streamSpeech(args: {
    model: StreamingSpeechGenerationModel<SpeechGenerationModelSettings>;
    text: AsyncIterable<string> | string;
    fullResponse?: false;
} & FunctionOptions): Promise<AsyncIterable<Buffer>>;
export declare function streamSpeech(args: {
    model: StreamingSpeechGenerationModel<SpeechGenerationModelSettings>;
    text: AsyncIterable<string> | string;
    fullResponse: true;
} & FunctionOptions): Promise<{
    speechStream: AsyncIterable<Buffer>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;
