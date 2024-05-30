import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createAudioMpegResponseHandler, postJsonToApi, } from "../../core/api/postToApi.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { failedOpenAICallResponseHandler } from "./OpenAIError.js";
/**
 * @see https://openai.com/pricing
 */
export const OPENAI_SPEECH_MODELS = {
    "tts-1": {
        costInMillicentsPerCharacter: 1.5, // = 1500 / 1000,
    },
    "tts-1-hd": {
        costInMillicentsPerCharacter: 3, // = 3000 / 1000
    },
};
export const calculateOpenAISpeechCostInMillicents = ({ model, input, }) => {
    if (!OPENAI_SPEECH_MODELS[model]) {
        return null;
    }
    return (input.length * OPENAI_SPEECH_MODELS[model].costInMillicentsPerCharacter);
};
/**
 * Synthesize speech using the OpenAI API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/createSpeech
 */
export class OpenAISpeechModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "openai"
        });
    }
    get voice() {
        return this.settings.voice;
    }
    get modelName() {
        return this.settings.model;
    }
    async callAPI(text, callOptions) {
        const api = this.settings.api ?? new OpenAIApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => postJsonToApi({
                url: api.assembleUrl(`/audio/speech`),
                headers: api.headers({
                    functionType: callOptions.functionType,
                    functionId: callOptions.functionId,
                    run: callOptions.run,
                    callId: callOptions.callId,
                }),
                body: {
                    input: text,
                    voice: this.settings.voice,
                    speed: this.settings.speed,
                    model: this.settings.model,
                    response_format: this.settings.responseFormat,
                },
                failedResponseHandler: failedOpenAICallResponseHandler,
                successfulResponseHandler: createAudioMpegResponseHandler(),
                abortSignal,
            }),
        });
    }
    get settingsForEvent() {
        return {
            voice: this.settings.voice,
            speed: this.settings.speed,
            model: this.settings.model,
            responseFormat: this.settings.responseFormat,
        };
    }
    doGenerateSpeechStandard(text, options) {
        return this.callAPI(text, options);
    }
    withSettings(additionalSettings) {
        return new OpenAISpeechModel({
            ...this.settings,
            ...additionalSettings,
        });
    }
}
