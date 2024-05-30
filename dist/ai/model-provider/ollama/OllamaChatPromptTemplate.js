import { validateContentIsString } from "../../model-function/generate-text/prompt-template/ContentPart.js";
import { InvalidPromptError } from "../../model-function/generate-text/prompt-template/InvalidPromptError.js";
/**
 * OllamaChatPrompt identity chat format.
 */
export function identity() {
    return { format: (prompt) => prompt, stopSequences: [] };
}
/**
 * Formats a text prompt as an Ollama chat prompt.
 */
export function text() {
    return {
        format: (prompt) => [{ role: "user", content: prompt }],
        stopSequences: [],
    };
}
/**
 * Formats an instruction prompt as an Ollama chat prompt.
 */
export function instruction() {
    return {
        format(prompt) {
            const messages = [];
            if (prompt.system != null) {
                messages.push({
                    role: "system",
                    content: prompt.system,
                });
            }
            messages.push({
                role: "user",
                ...extractUserContent(prompt.instruction),
            });
            return messages;
        },
        stopSequences: [],
    };
}
/**
 * Formats a chat prompt as an Ollama chat prompt.
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
                        messages.push({
                            role: "user",
                            ...extractUserContent(content),
                        });
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
function extractUserContent(input) {
    if (typeof input === "string") {
        return { content: input, images: undefined };
    }
    const images = [];
    let content = "";
    for (const part of input) {
        if (part.type === "text") {
            content += part.text;
        }
        else {
            images.push(part.base64Image);
        }
    }
    return { content, images };
}
