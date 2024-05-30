import { InvalidPromptError } from "./InvalidPromptError.js";
export function validateContentIsString(content, prompt) {
    if (typeof content !== "string") {
        throw new InvalidPromptError("Only text prompts are are supported by this prompt template.", prompt);
    }
    return content;
}
