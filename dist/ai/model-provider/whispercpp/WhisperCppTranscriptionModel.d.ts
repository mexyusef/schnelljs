/// <reference types="node" />
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { TranscriptionModel, TranscriptionModelSettings } from "../../model-function/generate-transcription/TranscriptionModel.js";
export interface WhisperCppTranscriptionModelSettings extends TranscriptionModelSettings {
    api?: ApiConfiguration;
    temperature?: number;
}
export type WhisperCppTranscriptionInput = {
    type: "wav";
    data: Buffer;
};
export declare class WhisperCppTranscriptionModel extends AbstractModel<WhisperCppTranscriptionModelSettings> implements TranscriptionModel<WhisperCppTranscriptionInput, WhisperCppTranscriptionModelSettings> {
    constructor(settings: WhisperCppTranscriptionModelSettings);
    readonly provider: "whispercpp";
    readonly modelName: null;
    doTranscribe(data: WhisperCppTranscriptionInput, options: FunctionCallOptions): Promise<{
        rawResponse: {
            text: string;
        };
        transcription: string;
    }>;
    callAPI(data: WhisperCppTranscriptionInput, callOptions: FunctionCallOptions): Promise<{
        text: string;
    }>;
    get settingsForEvent(): Partial<WhisperCppTranscriptionModelSettings>;
    withSettings(additionalSettings: WhisperCppTranscriptionModelSettings): this;
}
