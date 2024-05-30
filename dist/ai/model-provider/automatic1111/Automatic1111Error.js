import { z } from "zod";
import { createJsonErrorResponseHandler, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
const automatic1111ErrorDataSchema = z.object({
    error: z.string(),
    detail: z.string(),
    body: z.string(),
    errors: z.string(),
});
export const failedAutomatic1111CallResponseHandler = createJsonErrorResponseHandler({
    errorSchema: zodSchema(automatic1111ErrorDataSchema),
    errorToMessage: (error) => error.detail,
});
