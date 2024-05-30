import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { ChatPrompt } from "./ChatPrompt.js";
import { InstructionPrompt } from "./InstructionPrompt.js";
/**
 * Formats a text prompt as an Alpaca prompt.
 */
export declare function text(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as an Alpaca prompt.
 *
 * If the instruction has a system prompt, it overrides the default system prompt
 * (which can impact the results, because the model may be trained on the default system prompt).
 *
 * Prompt template with input:
 * ```
 * Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
 *
 * ### Instruction:
 *
 * {instruction}
 *
 * ### Input:
 *
 * {input}
 *
 * ### Response:
 *
 * ```
 *
 * Prompt template without input:
 * ```
 * Below is an instruction that describes a task. Write a response that appropriately completes the request.
 *
 * ### Instruction:
 *
 * {instruction}
 *
 * ### Response:
 *
 * ```
 *
 * @see https://github.com/tatsu-lab/stanford_alpaca#data-release
 */
export declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt & {
    input?: string;
}, // optional input supported by Alpaca
string>;
/**
 * Not supported by Alpaca.
 */
export declare function chat(): TextGenerationPromptTemplate<ChatPrompt, string>;
