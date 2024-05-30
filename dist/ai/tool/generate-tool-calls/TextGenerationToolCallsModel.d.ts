import { FunctionOptions } from "../../core/FunctionOptions.js";
import { TextGenerationModel } from "../../model-function/generate-text/TextGenerationModel.js";
import { ToolDefinition } from "../ToolDefinition.js";
import { ToolCallsGenerationModel, ToolCallsGenerationModelSettings } from "./ToolCallsGenerationModel.js";
import { ToolCallsPromptTemplate } from "./ToolCallsPromptTemplate.js";
export declare class TextGenerationToolCallsModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, ToolCallsGenerationModelSettings>> implements ToolCallsGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    private readonly model;
    private readonly template;
    constructor({ model, template, }: {
        model: MODEL;
        template: ToolCallsPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): import("../../index.js").ModelInformation;
    get settings(): ToolCallsGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    doGenerateToolCalls(tools: Array<ToolDefinition<string, unknown>>, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        text: string | null;
        toolCalls: {
            id: string;
            name: string;
            args: unknown;
        }[] | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}
