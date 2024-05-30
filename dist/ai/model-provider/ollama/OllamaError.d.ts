import { z } from "zod";
import { ApiCallError } from "../../core/api/ApiCallError.js";
import { ResponseHandler } from "../../core/api/postToApi.js";
declare const ollamaErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
}, {
    error: string;
}>;
export type OllamaErrorData = z.infer<typeof ollamaErrorDataSchema>;
export declare const failedOllamaCallResponseHandler: ResponseHandler<ApiCallError>;
export {};
