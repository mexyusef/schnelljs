export function getFunctionCallLogger(logging) {
    switch (logging) {
        case "basic-text":
            return [basicTextObserver];
        case "detailed-object":
            return [detailedObjectObserver];
        case "detailed-json":
            return [detailedJsonObserver];
        case "off":
        default:
            return [];
    }
}
const basicTextObserver = {
    onFunctionEvent(event) {
        const text = `[${event.timestamp.toISOString()}] ${event.callId}${event.functionId != null ? ` (${event.functionId})` : ""} - ${event.functionType} ${event.eventType}`;
        // log based on event type:
        switch (event.eventType) {
            case "started": {
                console.log(text);
                break;
            }
            case "finished": {
                console.log(`${text} in ${event.durationInMs}ms`);
                break;
            }
        }
    },
};
const detailedObjectObserver = {
    onFunctionEvent(event) {
        // Remove the "response" property from the result (if any):
        if (event.eventType === "finished" &&
            event.result != null &&
            "rawResponse" in event.result &&
            event.result?.rawResponse != null) {
            event = {
                ...event,
                result: Object.fromEntries(Object.entries(event.result).filter(([k]) => k !== "rawResponse")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ),
            };
        }
        // filter all hard-to-read properties from event for cleaner console output:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function cleanObject(obj) {
            if (obj instanceof Date || typeof obj === "string") {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map((item) => cleanObject(item));
            }
            if (obj !== null && typeof obj === "object") {
                return Object.fromEntries(Object.entries(obj)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .map(([k, v]) => {
                    if (v === undefined) {
                        return [k, undefined];
                    }
                    else if (v instanceof Buffer) {
                        return [k, "omitted<Buffer>"];
                    }
                    else if (Array.isArray(v) &&
                        v.length > 20 &&
                        v.every((v) => typeof v === "number")) {
                        return [k, "omitted<Array<number>>"];
                    }
                    else {
                        return [k, cleanObject(v)];
                    }
                })
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, v]) => v !== undefined));
            }
            return obj;
        }
        // Clean the event object
        const cleanedEvent = cleanObject(event);
        console.log(cleanedEvent);
    },
};
const detailedJsonObserver = {
    onFunctionEvent(event) {
        // Remove the "response" property from the result (if any):
        if (event.eventType === "finished" &&
            event.result != null &&
            "rawResponse" in event.result &&
            event.result?.rawResponse != null) {
            event = {
                ...event,
                result: Object.fromEntries(Object.entries(event.result).filter(([k]) => k !== "rawResponse")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ),
            };
        }
        // filter all undefined properties from event for cleaner console output:
        event = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(event).filter(([_, v]) => v !== undefined));
        console.log(JSON.stringify(event));
    },
};
