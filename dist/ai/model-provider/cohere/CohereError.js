import { z } from "zod";
import { createJsonErrorResponseHandler } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
const cohereErrorDataSchema = z.object({
    message: z.string(),
});
export const failedCohereCallResponseHandler = createJsonErrorResponseHandler({
    errorSchema: zodSchema(cohereErrorDataSchema),
    errorToMessage: (error) => error.message,
});
