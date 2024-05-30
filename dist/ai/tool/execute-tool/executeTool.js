import { nanoid as createId } from "nanoid";
import { FunctionEventSource } from "../../core/FunctionEventSource.js";
import { getFunctionObservers, getLogFormat, } from "../../core/ModelFusionConfiguration.js";
import { AbortError } from "../../core/api/AbortError.js";
import { getFunctionCallLogger } from "../../core/getFunctionCallLogger.js";
import { getRun } from "../../core/getRun.js";
import { startDurationMeasurement } from "../../util/DurationMeasurement.js";
import { runSafe } from "../../util/runSafe.js";
import { ToolExecutionError } from "../ToolExecutionError.js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeTool({ tool, args, fullResponse, ...options }) {
    const callResponse = await doExecuteTool({ tool, args, ...options });
    return fullResponse ? callResponse : callResponse.output;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function doExecuteTool({ tool, args, ...options }) {
    const run = await getRun(options?.run);
    const eventSource = new FunctionEventSource({
        observers: [
            ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
            ...getFunctionObservers(),
            ...(run?.functionObserver != null ? [run.functionObserver] : []),
            ...(options?.observers ?? []),
        ],
        errorHandler: run?.errorHandler,
    });
    const durationMeasurement = startDurationMeasurement();
    const metadata = {
        functionType: "execute-tool",
        callId: `call-${createId()}`,
        parentCallId: options?.callId,
        runId: run?.runId,
        sessionId: run?.sessionId,
        userId: run?.userId,
        functionId: options?.functionId,
        toolName: tool.name,
        input: args,
    };
    eventSource.notify({
        ...metadata,
        eventType: "started",
        timestamp: durationMeasurement.startDate,
        startTimestamp: durationMeasurement.startDate,
    });
    const result = await runSafe(() => tool.execute(args, {
        functionType: metadata.functionType,
        callId: metadata.callId,
        functionId: options?.functionId,
        logging: options?.logging,
        observers: options?.observers,
        run,
    }));
    const finishMetadata = {
        ...metadata,
        eventType: "finished",
        timestamp: new Date(),
        startTimestamp: durationMeasurement.startDate,
        finishTimestamp: new Date(),
        durationInMs: durationMeasurement.durationInMs,
    };
    if (!result.ok) {
        if (result.isAborted) {
            eventSource.notify({
                ...finishMetadata,
                result: {
                    status: "abort",
                },
            });
            throw new AbortError();
        }
        eventSource.notify({
            ...finishMetadata,
            result: {
                status: "error",
                error: result.error,
            },
        });
        throw new ToolExecutionError({
            toolName: tool.name,
            input: args,
            cause: result.error,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message: result.error?.message,
        });
    }
    const output = result.value;
    eventSource.notify({
        ...finishMetadata,
        result: {
            status: "success",
            value: output,
        },
    });
    return {
        output,
        metadata: finishMetadata,
    };
}
