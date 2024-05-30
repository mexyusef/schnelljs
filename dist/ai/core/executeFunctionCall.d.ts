import { FunctionCallOptions, FunctionOptions } from "./FunctionOptions.js";
import { FunctionEvent } from "./FunctionEvent.js";
export declare function executeFunctionCall<VALUE>({ options, input, functionType, execute, inputPropertyName, outputPropertyName, }: {
    options?: FunctionOptions;
    input: unknown;
    functionType: FunctionEvent["functionType"];
    execute: (options: FunctionCallOptions) => PromiseLike<VALUE>;
    inputPropertyName?: string;
    outputPropertyName?: string;
}): Promise<VALUE>;
