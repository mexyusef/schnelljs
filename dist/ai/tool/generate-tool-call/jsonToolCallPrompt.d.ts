import { InstructionPrompt } from "../../model-function/generate-text/prompt-template/InstructionPrompt.js";
import { ToolCallPromptTemplate } from "./TextGenerationToolCallModel.js";
export declare const jsonToolCallPrompt: {
    text(): ToolCallPromptTemplate<string, InstructionPrompt>;
};
