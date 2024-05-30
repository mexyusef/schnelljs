import { FunctionOptions } from "../core/FunctionOptions.js";
import { Tool } from "./Tool.js";
declare const RETURN_TYPE_SCHEMA: import("../core/schema/ZodSchema.js").ZodSchema<{
    results: {
        link: string;
        title: string;
        snippet: string;
    }[];
}>;
export type WebSearchToolInput = {
    query: string;
};
export type WebSearchToolOutput = {
    results: {
        title: string;
        link: string;
        snippet: string;
    }[];
};
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
export declare class WebSearchTool<NAME extends string> extends Tool<NAME, WebSearchToolInput, WebSearchToolOutput> {
    readonly returnType: typeof RETURN_TYPE_SCHEMA;
    constructor({ name, description, queryDescription, execute, }: {
        name: NAME;
        description: string;
        queryDescription?: string;
        execute(input: WebSearchToolInput, options?: FunctionOptions): PromiseLike<WebSearchToolOutput>;
    });
}
export {};
