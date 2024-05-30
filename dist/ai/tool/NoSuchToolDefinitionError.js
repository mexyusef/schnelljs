export class NoSuchToolDefinitionError extends Error {
    constructor({ toolName, parameters, }) {
        super(`Tool definition '${toolName}' not found. ` +
            `Parameters: ${JSON.stringify(parameters)}.`);
        Object.defineProperty(this, "toolName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = "NoSuchToolDefinitionError";
        this.toolName = toolName;
        this.parameters = parameters;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            toolName: this.toolName,
            parameter: this.parameters,
        };
    }
}
