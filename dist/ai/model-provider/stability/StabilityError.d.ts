import { z } from "zod";
import { ApiCallError } from "../../core/api/ApiCallError.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
declare const stabilityErrorDataSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type StabilityErrorData = z.infer<typeof stabilityErrorDataSchema>;
export declare const failedStabilityCallResponseHandler: ResponseHandler<ApiCallError>;
export {};
