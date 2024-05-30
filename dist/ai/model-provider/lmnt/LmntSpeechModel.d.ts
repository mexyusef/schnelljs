/// <reference types="node" />
import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { SpeechGenerationModel, SpeechGenerationModelSettings } from "../../model-function/generate-speech/SpeechGenerationModel.js";
export interface LmntSpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * The voice id of the voice to use for synthesis.
     */
    voice: string;
    /**
     * The talking speed of the generated speech. A Floating point value between 0.25 (slow) and 2.0 (fast); defaults to 1.0
     */
    speed?: number;
    /**
     * Seed used to specify a different take; defaults to random
     */
    seed?: number;
    /**
     * Produce speech of this length in seconds; maximum 300.0 (5 minutes)
     */
    length?: number;
}
/**
 * Synthesize speech using the LMNT API.
 *
 * @see https://docs.lmnt.com/api-reference/speech/synthesize-speech-1
 */
export declare class LmntSpeechModel extends AbstractModel<LmntSpeechModelSettings> implements SpeechGenerationModel<LmntSpeechModelSettings> {
    constructor(settings: LmntSpeechModelSettings);
    readonly provider = "lmnt";
    get modelName(): string;
    private callAPI;
    get settingsForEvent(): Partial<LmntSpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Buffer>;
    withSettings(additionalSettings: Partial<LmntSpeechModelSettings>): this;
}
declare const lmntSpeechResponseSchema: z.ZodObject<{
    audio: z.ZodString;
    durations: z.ZodArray<z.ZodObject<{
        duration: z.ZodNumber;
        start: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        duration: number;
        start: number;
    }, {
        text: string;
        duration: number;
        start: number;
    }>, "many">;
    seed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    seed: number;
    audio: string;
    durations: {
        text: string;
        duration: number;
        start: number;
    }[];
}, {
    seed: number;
    audio: string;
    durations: {
        text: string;
        duration: number;
        start: number;
    }[];
}>;
export type LmntSpeechResponse = z.infer<typeof lmntSpeechResponseSchema>;
export {};
