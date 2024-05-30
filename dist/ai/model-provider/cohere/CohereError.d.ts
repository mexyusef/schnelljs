import { z } from "zod";
declare const cohereErrorDataSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type CohereErrorData = z.infer<typeof cohereErrorDataSchema>;
export declare const failedCohereCallResponseHandler: import("../../core/api/postToApi.js").ResponseHandler<import("../../index.js").ApiCallError>;
export {};
