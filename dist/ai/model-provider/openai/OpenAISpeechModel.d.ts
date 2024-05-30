/// <reference types="node" />
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { SpeechGenerationModel, SpeechGenerationModelSettings } from "../../model-function/generate-speech/SpeechGenerationModel.js";
/**
 * @see https://openai.com/pricing
 */
export declare const OPENAI_SPEECH_MODELS: {
    "tts-1": {
        costInMillicentsPerCharacter: number;
    };
    "tts-1-hd": {
        costInMillicentsPerCharacter: number;
    };
};
export type OpenAISpeechModelType = keyof typeof OPENAI_SPEECH_MODELS;
export declare const calculateOpenAISpeechCostInMillicents: ({ model, input, }: {
    model: OpenAISpeechModelType;
    input: string;
}) => number | null;
export type OpenAISpeechVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
type OpenAISpeechModelResponseFormat = "mp3" | "opus" | "aac" | "flac";
export interface OpenAISpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration;
    voice: OpenAISpeechVoice;
    model: OpenAISpeechModelType;
    /**
     * The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.
     */
    speed?: number;
    /**
     * Defaults to mp3.
     */
    responseFormat?: OpenAISpeechModelResponseFormat;
}
/**
 * Synthesize speech using the OpenAI API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/createSpeech
 */
export declare class OpenAISpeechModel extends AbstractModel<OpenAISpeechModelSettings> implements SpeechGenerationModel<OpenAISpeechModelSettings> {
    constructor(settings: OpenAISpeechModelSettings);
    readonly provider: "openai";
    get voice(): OpenAISpeechVoice;
    get modelName(): "tts-1" | "tts-1-hd";
    private callAPI;
    get settingsForEvent(): Partial<OpenAISpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Buffer>;
    withSettings(additionalSettings: Partial<OpenAISpeechModelSettings>): this;
}
export {};
