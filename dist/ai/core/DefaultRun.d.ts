import { ErrorHandler } from "../util/ErrorHandler.js";
import { FunctionEvent } from "./FunctionEvent.js";
import { FunctionObserver } from "./FunctionObserver.js";
import { Run } from "./Run.js";
export declare class DefaultRun implements Run {
    readonly runId: string;
    readonly sessionId?: string;
    readonly userId?: string;
    readonly abortSignal?: AbortSignal;
    readonly errorHandler: ErrorHandler;
    readonly events: FunctionEvent[];
    private functionEventSource;
    constructor({ runId, sessionId, userId, abortSignal, observers, errorHandler, }?: {
        runId?: string;
        sessionId?: string;
        userId?: string;
        abortSignal?: AbortSignal;
        observers?: FunctionObserver[];
        errorHandler?: ErrorHandler;
    });
    readonly functionObserver: {
        onFunctionEvent: (event: FunctionEvent) => void;
    };
}
