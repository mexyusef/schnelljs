import SecureJSON from "secure-json-parse";
import { JSONParseError } from "./JSONParseError.js";
import { safeValidateTypes, validateTypes } from "./validateTypes.js";
import { TypeValidationError } from "./TypeValidationError.js";
export function parseJSON({ text, schema, }) {
    try {
        const json = SecureJSON.parse(text);
        if (schema == null) {
            return json;
        }
        return validateTypes({ structure: json, schema });
    }
    catch (error) {
        if (error instanceof JSONParseError ||
            error instanceof TypeValidationError) {
            throw error;
        }
        throw new JSONParseError({ text, cause: error });
    }
}
export function safeParseJSON({ text, schema, }) {
    try {
        const json = SecureJSON.parse(text);
        if (schema == null) {
            return {
                success: true,
                data: json,
            };
        }
        return safeValidateTypes({ structure: json, schema });
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof JSONParseError
                ? error
                : new JSONParseError({ text, cause: error }),
        };
    }
}
