import { z } from "zod";
import { createJsonErrorResponseHandler, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
const ollamaErrorDataSchema = z.object({
    error: z.string(),
});
export const failedOllamaCallResponseHandler = createJsonErrorResponseHandler({
    errorSchema: zodSchema(ollamaErrorDataSchema),
    errorToMessage: (error) => error.error,
});
