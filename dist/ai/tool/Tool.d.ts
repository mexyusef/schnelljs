import { FunctionCallOptions, FunctionOptions } from "../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../core/schema/JsonSchemaProducer.js";
import { Schema } from "../core/schema/Schema.js";
import { ToolDefinition } from "./ToolDefinition.js";
/**
 * A tool is a function with a name, description and defined inputs that can be used
 * by agents and chatbots.
 */
export declare class Tool<NAME extends string, PARAMETERS, RESULT> implements ToolDefinition<NAME, PARAMETERS> {
    /**
     * The name of the tool.
     * Should be understandable for language models and unique among the tools that they know.
     */
    readonly name: NAME;
    /**
     * A description of what the tool does. Will be used by the language model to decide whether to use the tool.
     */
    readonly description: string;
    /**
     * The schema of the input that the tool expects. The language model will use this to generate the input.
     * Use descriptions to make the input understandable for the language model.
     */
    readonly parameters: Schema<PARAMETERS> & JsonSchemaProducer;
    /**
     * An optional schema of the output that the tool produces. This will be used to validate the output.
     */
    readonly returnType?: Schema<RESULT>;
    /**
     * The actual execution function of the tool.
     */
    readonly execute: (args: PARAMETERS, options: FunctionCallOptions) => PromiseLike<RESULT>;
    constructor({ name, description, parameters, returnType, execute, }: {
        name: NAME;
        description: string;
        parameters: Schema<PARAMETERS> & JsonSchemaProducer;
        returnType?: Schema<RESULT>;
        execute(args: PARAMETERS, options?: FunctionOptions): PromiseLike<RESULT>;
    });
}
