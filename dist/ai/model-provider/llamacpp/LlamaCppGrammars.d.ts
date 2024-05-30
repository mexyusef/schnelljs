/**
 * GBNF grammar for JSON.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/json.gbnf
 */
export declare const json: string;
/**
 * GBNF grammar for JSON array outputs. Restricts whitespace at the end of the array.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/json_arr.gbnf
 */
export declare const jsonArray: string;
/**
 * GBNF grammar for list outputs. List items are separated by newlines and start with `- `.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/list.gbnf
 */
export declare const list: string;
export { convertJsonSchemaToGBNF as fromJsonSchema } from "./convertJsonSchemaToGBNF.js";
