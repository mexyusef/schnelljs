/// <reference types="node" />
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { Delta } from "../../model-function/Delta.js";
import { SpeechGenerationModelSettings, StreamingSpeechGenerationModel } from "../../model-function/generate-speech/SpeechGenerationModel.js";
declare const elevenLabsModels: readonly ["eleven_multilingual_v2", "eleven_multilingual_v1", "eleven_monolingual_v1", "eleven_turbo_v2"];
export interface ElevenLabsSpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration & {
        apiKey: string;
    };
    voice: string;
    model?: (typeof elevenLabsModels)[number] | (string & {});
    optimizeStreamingLatency?: 0 | 1 | 2 | 3 | 4;
    outputFormat?: "mp3_44100" | "pcm_16000" | "pcm_22050" | "pcm_24000" | "pcm_44100";
    voiceSettings?: {
        stability: number;
        similarityBoost: number;
        style?: number;
        useSpeakerBoost?: boolean;
    };
    generationConfig?: {
        chunkLengthSchedule: number[];
    };
}
/**
 * Synthesize speech using the ElevenLabs Text to Speech API.
 *
 * Both regular text-to-speech and full duplex text-to-speech streaming are supported.
 *
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech-websockets
 */
export declare class ElevenLabsSpeechModel extends AbstractModel<ElevenLabsSpeechModelSettings> implements StreamingSpeechGenerationModel<ElevenLabsSpeechModelSettings> {
    constructor(settings: ElevenLabsSpeechModelSettings);
    readonly provider = "elevenlabs";
    get modelName(): string;
    private callAPI;
    get settingsForEvent(): Partial<ElevenLabsSpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Buffer>;
    doGenerateSpeechStreamDuplex(textStream: AsyncIterable<string>): Promise<AsyncIterable<Delta<Buffer>>>;
    withSettings(additionalSettings: Partial<ElevenLabsSpeechModelSettings>): this;
}
export {};
