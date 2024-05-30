import { HasContextWindowSize, HasTokenizer, TextGenerationModel, TextGenerationModelSettings } from "../TextGenerationModel.js";
import { ChatPrompt } from "./ChatPrompt.js";
/**
 * Keeps only the most recent messages in the prompt, while leaving enough space for the completion.
 *
 * It will remove user-ai message pairs that don't fit. The result is always a valid chat prompt.
 *
 * When the minimal chat prompt (system message + last user message) is already too long, it will only
 * return this minimal chat prompt.
 *
 * @see https://modelfusion.dev/guide/function/generate-text#limiting-the-chat-length
 */
export declare function trimChatPrompt({ prompt, model, tokenLimit, }: {
    prompt: ChatPrompt;
    model: TextGenerationModel<ChatPrompt, TextGenerationModelSettings> & HasTokenizer<ChatPrompt> & HasContextWindowSize;
    tokenLimit?: number;
}): Promise<ChatPrompt>;
