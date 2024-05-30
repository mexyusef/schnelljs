import { z } from "zod";
import { zodSchema } from "../core/schema/ZodSchema.js";
import { Tool } from "./Tool.js";
const RETURN_TYPE_SCHEMA = zodSchema(z.object({
    results: z.array(z.object({
        title: z.string(),
        link: z.string().url(),
        snippet: z.string(),
    })),
}));
// expose the schemas to library consumers:
const createParameters = (description) => 
// same structure, but with description:
zodSchema(z.object({
    query: z.string().describe(description),
}));
/**
 * A tool for searching the web.
 *
 * The input schema takes a query string.
 * ```ts
 * {
 *   query: "How many people live in Berlin?"
 * }
 * ```
 *
 * The output schema is an array of search results with title, link and snippet.
 * ```ts
 * {
 *  results:
 *   [
 *     {
 *       title: "Berlin - Wikipedia",
 *       link: "https://en.wikipedia.org/wiki/Berlin",
 *       snippet: "Berlin is the capital and largest city of Germany by...",
 *     },
 *     ...
 *   ]
 * }
 * ```
 */
export class WebSearchTool extends Tool {
    constructor({ name, description, queryDescription = "Search query", execute, }) {
        super({
            name,
            description,
            parameters: createParameters(queryDescription),
            returnType: RETURN_TYPE_SCHEMA,
            execute,
        });
    }
}
