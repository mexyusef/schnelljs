import { FunctionOptions } from "../../core/FunctionOptions.js";
import { TextGenerationModel, TextGenerationModelSettings } from "../../model-function/generate-text/TextGenerationModel.js";
import { ToolDefinition } from "../ToolDefinition.js";
import { ToolCallGenerationModel } from "./ToolCallGenerationModel.js";
export interface ToolCallPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> {
    createPrompt: (prompt: SOURCE_PROMPT, tool: ToolDefinition<string, unknown>) => TARGET_PROMPT;
    extractToolCall: (response: string, tool: ToolDefinition<string, unknown>) => {
        id: string;
        args: unknown;
    } | null;
}
export declare class TextGenerationToolCallModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, TextGenerationModelSettings>> implements ToolCallGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    private readonly model;
    private readonly format;
    constructor({ model, format, }: {
        model: MODEL;
        format: ToolCallPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): import("../../index.js").ModelInformation;
    get settings(): TextGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}
