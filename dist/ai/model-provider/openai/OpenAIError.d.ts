import { z } from "zod";
declare const openAIErrorDataSchema: z.ZodObject<{
    error: z.ZodObject<{
        message: z.ZodString;
        type: z.ZodString;
        param: z.ZodNullable<z.ZodAny>;
        code: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    }, {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    };
}, {
    error: {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    };
}>;
export type OpenAIErrorData = z.infer<typeof openAIErrorDataSchema>;
export declare const failedOpenAICallResponseHandler: import("../../core/api/postToApi.js").ResponseHandler<import("../../index.js").ApiCallError>;
export {};
