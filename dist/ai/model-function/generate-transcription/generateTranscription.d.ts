import { FunctionOptions } from "../../core/FunctionOptions.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { TranscriptionModel, TranscriptionModelSettings } from "./TranscriptionModel.js";
/**
 * Transcribe audio data into text. Also called speech-to-text (STT) or automatic speech recognition (ASR).
 *
 * @see https://modelfusion.dev/guide/function/generate-transcription
 *
 * @example
 * const data = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await generateTranscription({
 *   model: openai.Transcriber({ model: "whisper-1" }),
 *   data: { type: "mp3", data }
 * });
 *
 * @param {TranscriptionModel<DATA, TranscriptionModelSettings>} model - The model to use for transcription.
 * @param {DATA} data - The data to transcribe.
 *
 * @returns {Promise<string>} A promise that resolves to the transcribed text.
 */
export declare function generateTranscription<DATA>(args: {
    model: TranscriptionModel<DATA, TranscriptionModelSettings>;
    data: DATA;
    fullResponse?: false;
} & FunctionOptions): Promise<string>;
export declare function generateTranscription<DATA>(args: {
    model: TranscriptionModel<DATA, TranscriptionModelSettings>;
    data: DATA;
    fullResponse: true;
} & FunctionOptions): Promise<{
    value: string;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
