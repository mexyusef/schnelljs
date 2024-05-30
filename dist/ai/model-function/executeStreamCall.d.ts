import { FunctionCallOptions, FunctionOptions } from "../core/FunctionOptions.js";
import { Delta } from "./Delta.js";
import { Model, ModelSettings } from "./Model.js";
import { ModelCallStartedEvent } from "./ModelCallEvent.js";
import { ModelCallMetadata } from "./ModelCallMetadata.js";
export declare function executeStreamCall<DELTA_VALUE, VALUE, MODEL extends Model<ModelSettings>>({ model, options, input, functionType, startStream, processDelta, processFinished, onDone, }: {
    model: MODEL;
    options?: FunctionOptions;
    input: unknown;
    functionType: ModelCallStartedEvent["functionType"];
    startStream: (options: FunctionCallOptions) => PromiseLike<AsyncIterable<Delta<DELTA_VALUE>>>;
    processDelta: (delta: Delta<DELTA_VALUE> & {
        type: "delta";
    }) => VALUE | undefined;
    processFinished?: () => VALUE | undefined;
    onDone?: () => void;
}): Promise<{
    value: AsyncIterable<VALUE>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;
