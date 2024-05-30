import { Schema } from "./Schema.js";
import { TypeValidationError } from "./TypeValidationError.js";
/**
 * Validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} structure - The JSON structure to validate.
 * @param {Schema<T>} schema - The schema to use for validating the JSON.
 * @returns {T} - The typed object.
 */
export declare function validateTypes<T>({ structure, schema, }: {
    structure: unknown;
    schema: Schema<T>;
}): T;
/**
 * Safely validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} structure - The JSON object to validate.
 * @param {Schema<T>} schema - The schema to use for validating the JSON.
 * @returns An object with either a `success` flag and the parsed and typed data, or a `success` flag and an error object.
 */
export declare function safeValidateTypes<T>({ structure, schema, }: {
    structure: unknown;
    schema: Schema<T>;
}): {
    success: true;
    data: T;
} | {
    success: false;
    error: TypeValidationError;
};
