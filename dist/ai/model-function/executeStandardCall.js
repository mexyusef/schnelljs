import { nanoid as createId } from "nanoid";
import { FunctionEventSource } from "../core/FunctionEventSource.js";
import { getLogFormat } from "../core/ModelFusionConfiguration.js";
import { getFunctionObservers } from "../core/ModelFusionConfiguration.js";
import { AbortError } from "../core/api/AbortError.js";
import { getFunctionCallLogger } from "../core/getFunctionCallLogger.js";
import { getRun } from "../core/getRun.js";
import { startDurationMeasurement } from "../util/DurationMeasurement.js";
import { runSafe } from "../util/runSafe.js";
export async function executeStandardCall({ model, options, input, functionType, generateResponse, }) {
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
    const result = await runSafe(() => generateResponse({
        functionType,
        functionId: options?.functionId,
        callId: startMetadata.callId,
        logging: options?.logging,
        observers: options?.observers,
        cache: options?.cache,
        run,
    }));
    const finishMetadata = {
        eventType: "finished",
        ...startMetadata,
        finishTimestamp: new Date(),
        durationInMs: durationMeasurement.durationInMs,
    };
    if (!result.ok) {
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
    const rawResponse = result.value.rawResponse;
    const value = result.value.extractedValue;
    const usage = result.value.usage;
    eventSource.notify({
        ...finishMetadata,
        eventType: "finished",
        result: {
            status: "success",
            usage,
            rawResponse,
            value,
        },
    });
    return {
        value,
        rawResponse,
        metadata: {
            model: model.modelInformation,
            callId: finishMetadata.callId,
            runId: finishMetadata.runId,
            sessionId: finishMetadata.sessionId,
            userId: finishMetadata.userId,
            functionId: finishMetadata.functionId,
            startTimestamp: startMetadata.startTimestamp,
            finishTimestamp: finishMetadata.finishTimestamp,
            durationInMs: finishMetadata.durationInMs,
            usage,
        },
    };
}
