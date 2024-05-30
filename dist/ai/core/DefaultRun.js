import { nanoid as createId } from "nanoid";
import { FunctionEventSource } from "./FunctionEventSource.js";
export class DefaultRun {
    constructor({ runId = `run-${createId()}`, sessionId, userId, abortSignal, observers, errorHandler, } = {}) {
        Object.defineProperty(this, "runId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "abortSignal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errorHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "functionEventSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "functionObserver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                onFunctionEvent: (event) => {
                    this.events.push(event);
                    this.functionEventSource.notify(event);
                },
            }
        });
        this.runId = runId;
        this.sessionId = sessionId;
        this.userId = userId;
        this.abortSignal = abortSignal;
        this.errorHandler = errorHandler ?? ((error) => console.error(error));
        this.functionEventSource = new FunctionEventSource({
            observers: observers ?? [],
            errorHandler: this.errorHandler.bind(this),
        });
    }
}
