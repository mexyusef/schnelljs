import { validateContentIsString } from "./ContentPart.js";
import { InvalidPromptError } from "./InvalidPromptError.js";
/**
 * Formats a text prompt as a Synthia text prompt.
 *
 * Synthia prompt template:
 * ```
 * USER: text
 * ASSISTANT:
 * ```
 */
export const text = () => ({
    stopSequences: [],
    format: (prompt) => `USER: ${prompt}\nASSISTANT: `,
});
/**
 * Formats an instruction prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: instruction
 * ASSISTANT: response prefix
 * ```
 */
export const instruction = () => ({
    stopSequences: [`\nUSER:`],
    format(prompt) {
        let text = prompt.system != null ? `SYSTEM: ${prompt.system}\n` : "";
        text += `USER: ${validateContentIsString(prompt.instruction, prompt)}\n`;
        text += `ASSISTANT: ${prompt.responsePrefix ?? ""}`;
        return text;
    },
});
/**
 * Formats a chat prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: user message
 * ASSISTANT: assistant message
 * ```
 */
export const chat = () => ({
    format(prompt) {
        let text = prompt.system != null ? `SYSTEM: ${prompt.system}\n` : "";
        for (const { role, content } of prompt.messages) {
            switch (role) {
                case "user": {
                    text += `USER: ${validateContentIsString(content, prompt)}\n`;
                    break;
                }
                case "assistant": {
                    text += `ASSISTANT: ${validateContentIsString(content, prompt)}\n`;
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
        // Assistant message prefix:
        text += `ASSISTANT: `;
        return text;
    },
    stopSequences: [`\nUSER:`],
});
