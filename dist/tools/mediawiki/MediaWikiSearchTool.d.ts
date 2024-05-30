import { WebSearchTool } from "../../ai";
export type MediaWikiSearchToolSettings<NAME extends string> = {
    name: NAME;
    /**
     * URL of the search API, e.g. "https://en.wikipedia.org/w/api.php",
     */
    url: string;
    description: string;
    queryDescription?: string;
    maxResults?: number;
    namespace?: string;
    profile?: "strict" | "normal" | "fuzzy" | "fast-fuzzy" | "classic" | "engine_autoselect";
    redirect?: "return" | "resolve";
};
/**
 * A tool for searching MediaWiki using the official API.
 * This tool can be used to e.g. search Wikipedia.
 *
 * @see https://en.wikipedia.org/w/api.php?action=help&modules=opensearch
 */
export declare class MediaWikiSearchTool<NAME extends string> extends WebSearchTool<NAME> {
    readonly settings: MediaWikiSearchToolSettings<NAME>;
    constructor(settings: MediaWikiSearchToolSettings<NAME>);
}
