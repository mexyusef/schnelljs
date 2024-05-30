import { FunctionOptions } from "../../core/FunctionOptions.js";
import { JsonSchemaProducer } from "../../core/schema/JsonSchemaProducer.js";
import { Schema } from "../../core/schema/Schema.js";
import { ModelCallMetadata } from "../ModelCallMetadata.js";
import { StructureGenerationModel, StructureGenerationModelSettings } from "./StructureGenerationModel.js";
/**
 * Generate a typed object for a prompt and a schema.
 *
 * @see https://modelfusion.dev/guide/function/generate-structure
 *
 * @example
 * const sentiment = await generateStructure({
 *   model: openai.ChatTextGenerator(...).asFunctionCallStructureGenerationModel(...),
 *
 *   schema: zodSchema(z.object({
 *     sentiment: z
 *       .enum(["positive", "neutral", "negative"])
 *       .describe("Sentiment."),
 *   })),
 *
 *   prompt: [
 *     openai.ChatMessage.system(
 *       "You are a sentiment evaluator. " +
 *         "Analyze the sentiment of the following product review:"
 *     ),
 *     openai.ChatMessage.user(
 *       "After I opened the package, I was met by a very unpleasant smell " +
 *         "that did not disappear even after washing. Never again!"
 *     ),
 *   ]
 * });
 *
 * @param {StructureGenerationModel<PROMPT, SETTINGS>} model - The model to generate the structure.
 * @param {Schema<STRUCTURE>} schema - The schema to be used.
 * @param {PROMPT | ((schema: Schema<STRUCTURE>) => PROMPT)} prompt
 * The prompt to be used.
 * You can also pass a function that takes the schema as an argument and returns the prompt.
 *
 * @returns {Promise<STRUCTURE>} - Returns a promise that resolves to the generated structure.
 */
export declare function generateStructure<STRUCTURE, PROMPT, SETTINGS extends StructureGenerationModelSettings>(args: {
    model: StructureGenerationModel<PROMPT, SETTINGS>;
    schema: Schema<STRUCTURE> & JsonSchemaProducer;
    prompt: PROMPT | ((schema: Schema<STRUCTURE>) => PROMPT);
    fullResponse?: false;
} & FunctionOptions): Promise<STRUCTURE>;
export declare function generateStructure<STRUCTURE, PROMPT, SETTINGS extends StructureGenerationModelSettings>(args: {
    model: StructureGenerationModel<PROMPT, SETTINGS>;
    schema: Schema<STRUCTURE> & JsonSchemaProducer;
    prompt: PROMPT | ((schema: Schema<STRUCTURE>) => PROMPT);
    fullResponse: true;
} & FunctionOptions): Promise<{
    structure: STRUCTURE;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
