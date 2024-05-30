/**
 * Error thrown when a prompt validation fails.
 */
export class InvalidPromptError extends Error {
    constructor(message, prompt) {
        super(message);
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "InvalidPromptError";
        this.prompt = prompt;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
            prompt: this.prompt,
        };
    }
}
