import { FunctionCallOptions, FunctionOptions } from "../core/FunctionOptions.js";
import { Model, ModelSettings } from "./Model.js";
import { ModelCallStartedEvent } from "./ModelCallEvent.js";
import { ModelCallMetadata } from "./ModelCallMetadata.js";
export declare function executeStandardCall<VALUE, MODEL extends Model<ModelSettings>>({ model, options, input, functionType, generateResponse, }: {
    model: MODEL;
    options?: FunctionOptions;
    input: unknown;
    functionType: ModelCallStartedEvent["functionType"];
    generateResponse: (options: FunctionCallOptions) => PromiseLike<{
        rawResponse: unknown;
        extractedValue: VALUE;
        usage?: unknown;
    }>;
}): Promise<{
    value: VALUE;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
