import { z } from "zod";
import { ApiCallError } from "../../core/api/ApiCallError.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
declare const mistralErrorDataSchema: z.ZodObject<{
    object: z.ZodLiteral<"error">;
    message: z.ZodString;
    type: z.ZodString;
    param: z.ZodNullable<z.ZodString>;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    object: "error";
    message: string;
    code: string;
    type: string;
    param: string | null;
}, {
    object: "error";
    message: string;
    code: string;
    type: string;
    param: string | null;
}>;
export type MistralErrorData = z.infer<typeof mistralErrorDataSchema>;
export declare const failedMistralCallResponseHandler: ResponseHandler<ApiCallError>;
export {};
