import { z } from "zod";
declare const huggingFaceErrorDataSchema: z.ZodObject<{
    error: z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    error: (string | string[]) & (string | string[] | undefined);
}, {
    error: (string | string[]) & (string | string[] | undefined);
}>;
export type HuggingFaceErrorData = z.infer<typeof huggingFaceErrorDataSchema>;
export declare const failedHuggingFaceCallResponseHandler: import("../../core/api/postToApi.js").ResponseHandler<import("../../index.js").ApiCallError>;
export {};
