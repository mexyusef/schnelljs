import { nanoid as createId } from "nanoid";
import { FunctionEventSource } from "../core/FunctionEventSource.js";
import { getLogFormat } from "../core/ModelFusionConfiguration.js";
import { getFunctionObservers } from "../core/ModelFusionConfiguration.js";
import { AbortError } from "../core/api/AbortError.js";
import { getFunctionCallLogger } from "../core/getFunctionCallLogger.js";
import { getRun } from "../core/getRun.js";
import { AsyncQueue } from "../util/AsyncQueue.js";
import { startDurationMeasurement } from "../util/DurationMeasurement.js";
import { runSafe } from "../util/runSafe.js";
export async function executeStreamCall({ model, options, input, functionType, startStream, processDelta, processFinished, onDone, }) {
    const run = await getRun(options?.run);
    const settings = model.settings;
    const eventSource = new FunctionEventSource({
        observers: [
            ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
            ...getFunctionObservers(),
            ...(settings.observers ?? []),
            ...(run?.functionObserver != null ? [run.functionObserver] : []),
            ...(options?.observers ?? []),
        ],
        errorHandler: run?.errorHandler,
    });
    const durationMeasurement = startDurationMeasurement();
    const startMetadata = {
        functionType,
        callId: `call-${createId()}`,
        parentCallId: options?.callId,
        runId: run?.runId,
        sessionId: run?.sessionId,
        userId: run?.userId,
        functionId: options?.functionId,
        model: model.modelInformation,
        settings: model.settingsForEvent,
        input,
        timestamp: durationMeasurement.startDate,
        startTimestamp: durationMeasurement.startDate,
    };
    eventSource.notify({
        eventType: "started",
        ...startMetadata,
    });
    const result = await runSafe(async () => {
        const deltaIterable = await startStream({
            functionType,
            functionId: options?.functionId,
            callId: startMetadata.callId,
            logging: options?.logging,
            observers: options?.observers,
            run,
        });
        // Return a queue that can be iterated over several times:
        const responseQueue = new AsyncQueue();
        // run async:
        (async function () {
            try {
                const loopResult = await runSafe(async () => {
                    for await (const event of deltaIterable) {
                        if (event?.type === "error") {
                            const error = event.error;
                            const finishMetadata = {
                                eventType: "finished",
                                ...startMetadata,
                                finishTimestamp: new Date(),
                                durationInMs: durationMeasurement.durationInMs,
                            };
                            eventSource.notify(error instanceof AbortError
                                ? {
                                    ...finishMetadata,
                                    result: { status: "abort" },
                                }
                                : {
                                    ...finishMetadata,
                                    result: { status: "error", error },
                                });
                            throw error;
                        }
                        if (event?.type === "delta") {
                            const value = processDelta(event);
                            if (value !== undefined) {
                                responseQueue.push(value);
                            }
                        }
                    }
                    if (processFinished != null) {
                        const value = processFinished();
                        if (value !== undefined) {
                            responseQueue.push(value);
                        }
                    }
                });
                // deal with abort or errors that happened during streaming:
                if (!loopResult.ok) {
                    const finishMetadata = {
                        eventType: "finished",
                        ...startMetadata,
                        finishTimestamp: new Date(),
                        durationInMs: durationMeasurement.durationInMs,
                    };
                    if (loopResult.isAborted) {
                        eventSource.notify({
                            ...finishMetadata,
                            eventType: "finished",
                            result: {
                                status: "abort",
                            },
                        });
                        responseQueue.error(new AbortError());
                        return; // error is handled through queue
                    }
                    eventSource.notify({
                        ...finishMetadata,
                        eventType: "finished",
                        result: {
                            status: "error",
                            error: loopResult.error,
                        },
                    });
                    responseQueue.error(loopResult.error);
                    return; // error is handled through queue
                }
                onDone?.();
                const finishMetadata = {
                    eventType: "finished",
                    ...startMetadata,
                    finishTimestamp: new Date(),
                    durationInMs: durationMeasurement.durationInMs,
                };
                eventSource.notify({
                    ...finishMetadata,
                    result: {
                        status: "success",
                    },
                });
            }
            finally {
                // always close the queue when done, no matter where a potential error happened:
                responseQueue.close();
            }
        })();
        return {
            stream: responseQueue,
        };
    });
    if (!result.ok) {
        const finishMetadata = {
            eventType: "finished",
            ...startMetadata,
            finishTimestamp: new Date(),
            durationInMs: durationMeasurement.durationInMs,
        };
        if (result.isAborted) {
            eventSource.notify({
                ...finishMetadata,
                eventType: "finished",
                result: {
                    status: "abort",
                },
            });
            throw new AbortError();
        }
        eventSource.notify({
            ...finishMetadata,
            eventType: "finished",
            result: {
                status: "error",
                error: result.error,
            },
        });
        throw result.error;
    }
    return {
        value: result.value.stream,
        metadata: startMetadata,
    };
}
