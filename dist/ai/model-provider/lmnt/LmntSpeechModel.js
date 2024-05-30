import { z } from "zod";
import { callWithRetryAndThrottle } from "../../core/api/callWithRetryAndThrottle.js";
import { createJsonResponseHandler, createTextErrorResponseHandler, postToApi, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { LmntApiConfiguration } from "./LmntApiConfiguration.js";
/**
 * Synthesize speech using the LMNT API.
 *
 * @see https://docs.lmnt.com/api-reference/speech/synthesize-speech-1
 */
export class LmntSpeechModel extends AbstractModel {
    constructor(settings) {
        super({ settings });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "lmnt"
        });
    }
    get modelName() {
        return this.settings.voice;
    }
    async callAPI(text, callOptions) {
        const api = this.settings.api ?? new LmntApiConfiguration();
        const abortSignal = callOptions.run?.abortSignal;
        return callWithRetryAndThrottle({
            retry: api.retry,
            throttle: api.throttle,
            call: async () => {
                const formData = new FormData();
                formData.append("text", text);
                formData.append("voice", this.settings.voice);
                formData.append("format", "mp3");
                formData.append("return_durations", "true");
                if (this.settings.speed != null) {
                    formData.append("speed", this.settings.speed.toString());
                }
                if (this.settings.seed != null) {
                    formData.append("seed", this.settings.seed.toString());
                }
                if (this.settings.length != null) {
                    formData.append("length", this.settings.length.toString());
                }
                return postToApi({
                    url: api.assembleUrl(`/ai/speech`),
                    headers: api.headers({
                        functionType: callOptions.functionType,
                        functionId: callOptions.functionId,
                        run: callOptions.run,
                        callId: callOptions.callId,
                    }),
                    body: {
                        content: formData,
                        values: {
                            text,
                            voice: this.settings.voice,
                            speed: this.settings.speed,
                            seed: this.settings.seed,
                            length: this.settings.length,
                        },
                    },
                    failedResponseHandler: createTextErrorResponseHandler(),
                    successfulResponseHandler: createJsonResponseHandler(zodSchema(lmntSpeechResponseSchema)),
                    abortSignal,
                });
            },
        });
    }
    get settingsForEvent() {
        return {
            voice: this.settings.voice,
            speed: this.settings.speed,
            seed: this.settings.seed,
            length: this.settings.length,
        };
    }
    async doGenerateSpeechStandard(text, options) {
        const response = await this.callAPI(text, options);
        return Buffer.from(response.audio, "base64");
    }
    withSettings(additionalSettings) {
        return new LmntSpeechModel({
            ...this.settings,
            ...additionalSettings,
        });
    }
}
const lmntSpeechResponseSchema = z.object({
    audio: z.string(),
    durations: z.array(z.object({
        duration: z.number(),
        start: z.number(),
        text: z.string(),
    })),
    seed: z.number(),
});
