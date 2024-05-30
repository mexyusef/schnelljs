import { validateContentIsString } from "../../model-function/generate-text/prompt-template/ContentPart.js";
import { InvalidPromptError } from "../../model-function/generate-text/prompt-template/InvalidPromptError.js";
/**
 * Formats a text prompt as a Mistral prompt.
 */
export function text() {
    return {
        format: (prompt) => [{ role: "user", content: prompt }],
        stopSequences: [],
    };
}
/**
 * Formats an instruction prompt as a Mistral prompt.
 */
export function instruction() {
    return {
        format(prompt) {
            const messages = [];
            if (prompt.system != null) {
                messages.push({ role: "system", content: prompt.system });
            }
            const instruction = validateContentIsString(prompt.instruction, prompt);
            messages.push({ role: "user", content: instruction });
            return messages;
        },
        stopSequences: [],
    };
}
/**
 * Formats a chat prompt as a Mistral prompt.
 */
export function chat() {
    return {
        format(prompt) {
            const messages = [];
            if (prompt.system != null) {
                messages.push({ role: "system", content: prompt.system });
            }
            for (const { role, content } of prompt.messages) {
                switch (role) {
                    case "user": {
                        const textContent = validateContentIsString(content, prompt);
                        messages.push({ role: "user", content: textContent });
                        break;
                    }
                    case "assistant": {
                        messages.push({
                            role: "assistant",
                            content: validateContentIsString(content, prompt),
                        });
                        break;
                    }
                    case "tool": {
                        throw new InvalidPromptError("Tool messages are not supported.", prompt);
                    }
                    default: {
                        const _exhaustiveCheck = role;
                        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
                    }
                }
            }
            return messages;
        },
        stopSequences: [],
    };
}
