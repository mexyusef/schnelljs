export const ChatMessage = {
    user({ text }) {
        return {
            role: "user",
            content: text,
        };
    },
    tool({ toolResults, }) {
        return {
            role: "tool",
            content: createToolContent({ toolResults }),
        };
    },
    assistant({ text, toolResults, }) {
        return {
            role: "assistant",
            content: createAssistantContent({ text, toolResults }),
        };
    },
};
function createToolContent({ toolResults, }) {
    const toolContent = [];
    for (const { result, toolCall } of toolResults ?? []) {
        toolContent.push({
            type: "tool-response",
            id: toolCall.id,
            response: result,
        });
    }
    return toolContent;
}
function createAssistantContent({ text, toolResults, }) {
    const content = [];
    if (text != null) {
        content.push({ type: "text", text });
    }
    for (const { toolCall } of toolResults ?? []) {
        content.push({ type: "tool-call", ...toolCall });
    }
    return content;
}
