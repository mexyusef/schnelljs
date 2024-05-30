import { OpenAIChatMessage } from "./OpenAIChatMessage.js";
/**
 * OpenAIMessage[] identity chat format.
 */
export function identity() {
    return { format: (prompt) => prompt, stopSequences: [] };
}
/**
 * Formats a text prompt as an OpenAI chat prompt.
 */
export function text() {
    return {
        format: (prompt) => [OpenAIChatMessage.user(prompt)],
        stopSequences: [],
    };
}
/**
 * Formats an instruction prompt as an OpenAI chat prompt.
 */
export function instruction() {
    return {
        format(prompt) {
            const messages = [];
            if (prompt.system != null) {
                messages.push(OpenAIChatMessage.system(prompt.system));
            }
            messages.push(OpenAIChatMessage.user(prompt.instruction));
            return messages;
        },
        stopSequences: [],
    };
}
/**
 * Formats a chat prompt as an OpenAI chat prompt.
 */
export function chat() {
    return {
        format(prompt) {
            const messages = [];
            if (prompt.system != null) {
                messages.push(OpenAIChatMessage.system(prompt.system));
            }
            for (const { role, content } of prompt.messages) {
                switch (role) {
                    case "user": {
                        messages.push(OpenAIChatMessage.user(content));
                        break;
                    }
                    case "assistant": {
                        if (typeof content === "string") {
                            messages.push(OpenAIChatMessage.assistant(content));
                        }
                        else {
                            let text = "";
                            const toolCalls = [];
                            for (const part of content) {
                                switch (part.type) {
                                    case "text": {
                                        text += part.text;
                                        break;
                                    }
                                    case "tool-call": {
                                        toolCalls.push({
                                            id: part.id,
                                            type: "function",
                                            function: {
                                                name: part.name,
                                                arguments: JSON.stringify(part.args),
                                            },
                                        });
                                        break;
                                    }
                                    default: {
                                        const _exhaustiveCheck = part;
                                        throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
                                    }
                                }
                            }
                            messages.push({
                                role: "assistant",
                                content: text,
                                tool_calls: toolCalls,
                            });
                        }
                        break;
                    }
                    case "tool": {
                        for (const toolResponse of content) {
                            messages.push({
                                role: "tool",
                                tool_call_id: toolResponse.id,
                                content: JSON.stringify(toolResponse.response),
                            });
                        }
                        break;
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
