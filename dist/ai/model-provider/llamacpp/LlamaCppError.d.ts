import { z } from "zod";
declare const llamaCppErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
}, {
    error: string;
}>;
export type LlamaCppErrorData = z.infer<typeof llamaCppErrorDataSchema>;
export declare const failedLlamaCppCallResponseHandler: import("../../core/api/postToApi.js").ResponseHandler<import("../../index.js").ApiCallError>;
export {};
