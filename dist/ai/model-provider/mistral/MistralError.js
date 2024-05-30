import { z } from "zod";
import { createJsonErrorResponseHandler, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
const mistralErrorDataSchema = z.object({
    object: z.literal("error"),
    message: z.string(),
    type: z.string(),
    param: z.string().nullable(),
    code: z.string(),
});
export const failedMistralCallResponseHandler = createJsonErrorResponseHandler({
    errorSchema: zodSchema(mistralErrorDataSchema),
    errorToMessage: (error) => error.message,
});
