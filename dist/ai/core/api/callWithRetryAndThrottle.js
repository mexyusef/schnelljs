import { retryNever } from "./retryNever.js";
import { throttleOff } from "./throttleOff.js";
export const callWithRetryAndThrottle = async ({ retry = retryNever(), throttle = throttleOff(), call, }) => retry(async () => throttle(call));
