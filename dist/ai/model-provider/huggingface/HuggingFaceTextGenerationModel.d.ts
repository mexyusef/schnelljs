import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { AbstractModel } from "../../model-function/AbstractModel.js";
import { PromptTemplateTextGenerationModel } from "../../model-function/generate-text/PromptTemplateTextGenerationModel.js";
import { TextGenerationModel, TextGenerationModelSettings } from "../../model-function/generate-text/TextGenerationModel.js";
import { TextGenerationPromptTemplate } from "../../model-function/generate-text/TextGenerationPromptTemplate.js";
export interface HuggingFaceTextGenerationModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    topK?: number;
    topP?: number;
    temperature?: number;
    repetitionPenalty?: number;
    maxTime?: number;
    doSample?: boolean;
}
/**
 * Create a text generation model that calls a Hugging Face Inference API Text Generation Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "tiiuae/falcon-7b",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
export declare class HuggingFaceTextGenerationModel extends AbstractModel<HuggingFaceTextGenerationModelSettings> implements TextGenerationModel<string, HuggingFaceTextGenerationModelSettings> {
    constructor(settings: HuggingFaceTextGenerationModelSettings);
    readonly provider = "huggingface";
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    callAPI(prompt: string, callOptions: FunctionCallOptions): Promise<HuggingFaceTextGenerationResponse>;
    get settingsForEvent(): Partial<HuggingFaceTextGenerationModelSettings>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    processTextGenerationResponse(rawResponse: HuggingFaceTextGenerationResponse): {
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    withJsonOutput(): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextGenerationModel<INPUT_PROMPT, string, HuggingFaceTextGenerationModelSettings, this>;
    withSettings(additionalSettings: Partial<HuggingFaceTextGenerationModelSettings>): this;
}
declare const huggingFaceTextGenerationResponseSchema: z.ZodArray<z.ZodObject<{
    generated_text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    generated_text: string;
}, {
    generated_text: string;
}>, "many">;
export type HuggingFaceTextGenerationResponse = z.infer<typeof huggingFaceTextGenerationResponseSchema>;
export {};
