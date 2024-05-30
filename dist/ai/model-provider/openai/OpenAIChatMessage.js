export const OpenAIChatMessage = {
    /**
     * Creates a system chat message.
     */
    system(content) {
        return { role: "system", content };
    },
    /**
     * Creates a user chat message. The message can be a string or a multi-modal input.
     */
    user(content, options) {
        return {
            role: "user",
            content: typeof content === "string"
                ? content
                : content.map((element) => {
                    switch (element.type) {
                        case "text": {
                            return { type: "text", text: element.text };
                        }
                        case "image": {
                            return {
                                type: "image_url",
                                image_url: `data:${element.mimeType ?? "image/jpeg"};base64,${element.base64Image}`,
                            };
                        }
                    }
                }),
            name: options?.name,
        };
    },
    /**
     * Creates an assistant chat message.
     * The assistant message can optionally contain tool calls
     * or a function call (function calls are deprecated).
     */
    assistant(content, options) {
        return {
            role: "assistant",
            content,
            function_call: options?.functionCall == null
                ? undefined
                : {
                    name: options.functionCall.name,
                    arguments: options.functionCall.arguments,
                },
            tool_calls: options?.toolCalls?.map((toolCall) => ({
                id: toolCall.id,
                type: "function",
                function: {
                    name: toolCall.name,
                    arguments: JSON.stringify(toolCall.args),
                },
            })) ?? undefined,
        };
    },
    /**
     * Creates a function result chat message for tool call results.
     *
     * @deprecated OpenAI functions are deprecated in favor of tools.
     */
    fn({ fnName, content, }) {
        return { role: "function", name: fnName, content: JSON.stringify(content) };
    },
    /**
     * Creates a tool result chat message with the result of a tool call.
     */
    tool({ toolCallId, content, }) {
        return {
            role: "tool",
            tool_call_id: toolCallId,
            content: JSON.stringify(content),
        };
    },
};
