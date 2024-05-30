import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { PromptTemplate } from "../PromptTemplate.js";
import { ImageGenerationModel, ImageGenerationModelSettings } from "./ImageGenerationModel.js";
export declare class PromptTemplateImageGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS extends ImageGenerationModelSettings, MODEL extends ImageGenerationModel<MODEL_PROMPT, SETTINGS>> implements ImageGenerationModel<PROMPT, SETTINGS> {
    readonly model: MODEL;
    readonly promptTemplate: PromptTemplate<PROMPT, MODEL_PROMPT>;
    constructor({ model, promptTemplate, }: {
        model: MODEL;
        promptTemplate: PromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    get modelInformation(): import("../ModelInformation.js").ModelInformation;
    get settings(): SETTINGS;
    doGenerateImages(prompt: PROMPT, options: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        base64Images: string[];
    }>;
    get settingsForEvent(): Partial<SETTINGS>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, PROMPT>): PromptTemplateImageGenerationModel<INPUT_PROMPT, PROMPT, SETTINGS, this>;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}
