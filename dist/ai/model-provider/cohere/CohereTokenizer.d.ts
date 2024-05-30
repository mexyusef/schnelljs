import { z } from "zod";
import { FunctionCallOptions } from "../../core/FunctionOptions.js";
import { ApiConfiguration } from "../../core/api/ApiConfiguration.js";
import { FullTokenizer } from "../../model-function/tokenize-text/Tokenizer.js";
import { CohereTextEmbeddingModelType } from "./CohereTextEmbeddingModel.js";
import { CohereTextGenerationModelType } from "./CohereTextGenerationModel.js";
export type CohereTokenizerModelType = CohereTextGenerationModelType | CohereTextEmbeddingModelType;
export interface CohereTokenizerSettings {
    api?: ApiConfiguration;
    model: CohereTokenizerModelType;
}
/**
 * Tokenizer for the Cohere models. It uses the Co.Tokenize and Co.Detokenize APIs.
 *
 * @see https://docs.cohere.com/reference/tokenize
 * @see https://docs.cohere.com/reference/detokenize
 *
 * @example
 * const tokenizer = new CohereTokenizer({ model: "command" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
export declare class CohereTokenizer implements FullTokenizer {
    readonly settings: CohereTokenizerSettings;
    constructor(settings: CohereTokenizerSettings);
    callTokenizeAPI(text: string, callOptions?: FunctionCallOptions): Promise<CohereTokenizationResponse>;
    callDeTokenizeAPI(tokens: number[], callOptions?: FunctionCallOptions): Promise<CohereDetokenizationResponse>;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
}
declare const cohereDetokenizationResponseSchema: z.ZodObject<{
    text: z.ZodString;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    text: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}, {
    text: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}>;
export type CohereDetokenizationResponse = z.infer<typeof cohereDetokenizationResponseSchema>;
declare const cohereTokenizationResponseSchema: z.ZodObject<{
    tokens: z.ZodArray<z.ZodNumber, "many">;
    token_strings: z.ZodArray<z.ZodString, "many">;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    meta: {
        api_version: {
            version: string;
        };
    };
    tokens: number[];
    token_strings: string[];
}, {
    meta: {
        api_version: {
            version: string;
        };
    };
    tokens: number[];
    token_strings: string[];
}>;
export type CohereTokenizationResponse = z.infer<typeof cohereTokenizationResponseSchema>;
export {};
