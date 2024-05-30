import { z } from "zod";
import { ApiCallError } from "../../core/api/ApiCallError.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
declare const automatic1111ErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
    detail: z.ZodString;
    body: z.ZodString;
    errors: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
    errors: string;
    body: string;
    detail: string;
}, {
    error: string;
    errors: string;
    body: string;
    detail: string;
}>;
export type Automatic1111ErrorData = z.infer<typeof automatic1111ErrorDataSchema>;
export declare const failedAutomatic1111CallResponseHandler: ResponseHandler<ApiCallError>;
export {};
