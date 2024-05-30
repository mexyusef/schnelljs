/**
 * Creates a simplified websocket connection. This function works in both Node.js and browser.
 */
export async function createSimpleWebSocket(url) {
    if (typeof window === "undefined") {
        // Use ws library in Node.js:
        const { default: WebSocket } = await import("ws");
        return new WebSocket(url);
    }
    else {
        // Use native WebSocket in browser:
        return new WebSocket(url);
    }
}
