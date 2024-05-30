import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { BasicTokenizer } from "../../model-function/tokenize-text/Tokenizer.js";
/**
 * Tokenizer for LlamaCpp.

 * @example
 * const tokenizer = new LlamaCppTokenizer();
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
export declare class LlamaCppTokenizer implements BasicTokenizer {
    readonly api: ApiConfiguration;
    constructor(api?: ApiConfiguration);
    callTokenizeAPI(text: string, callOptions?: FunctionCallOptions): Promise<LlamaCppTokenizationResponse>;
    tokenize(text: string): Promise<number[]>;
}
declare const llamaCppTokenizationResponseSchema: z.ZodObject<{
    tokens: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    tokens: number[];
}, {
    tokens: number[];
}>;
export type LlamaCppTokenizationResponse = z.infer<typeof llamaCppTokenizationResponseSchema>;
export {};
