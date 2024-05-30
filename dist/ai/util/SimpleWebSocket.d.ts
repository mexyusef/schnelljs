export interface SimpleWebSocket {
    send(data: string): void;
    onmessage: ((event: MessageEvent) => void) | null;
    onopen: ((event: Event) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    close(code?: number, reason?: string): void;
}
/**
 * Creates a simplified websocket connection. This function works in both Node.js and browser.
 */
export declare function createSimpleWebSocket(url: string): Promise<SimpleWebSocket>;
