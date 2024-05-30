import { z } from "zod";
import { createJsonErrorResponseHandler, } from "../../core/api/postToApi.js";
import { zodSchema } from "../../core/schema/ZodSchema.js";
const stabilityErrorDataSchema = z.object({
    message: z.string(),
});
export const failedStabilityCallResponseHandler = createJsonErrorResponseHandler({
    errorSchema: zodSchema(stabilityErrorDataSchema),
    errorToMessage: (error) => error.message,
});
