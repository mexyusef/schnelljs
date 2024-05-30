/**
 * A tool is a function with a name, description and defined inputs that can be used
 * by agents and chatbots.
 */
export class Tool {
    constructor({ name, description, parameters, returnType, execute, }) {
        /**
         * The name of the tool.
         * Should be understandable for language models and unique among the tools that they know.
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A description of what the tool does. Will be used by the language model to decide whether to use the tool.
         */
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The schema of the input that the tool expects. The language model will use this to generate the input.
         * Use descriptions to make the input understandable for the language model.
         */
        Object.defineProperty(this, "parameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * An optional schema of the output that the tool produces. This will be used to validate the output.
         */
        Object.defineProperty(this, "returnType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The actual execution function of the tool.
         */
        Object.defineProperty(this, "execute", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.returnType = returnType;
        this.execute = execute;
    }
}
