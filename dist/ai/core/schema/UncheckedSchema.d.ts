import { JsonSchemaProducer } from "./JsonSchemaProducer.js";
import { Schema } from "./Schema.js";
export declare function uncheckedSchema<STRUCTURE>(jsonSchema?: unknown): UncheckedSchema<STRUCTURE>;
export declare class UncheckedSchema<STRUCTURE> implements Schema<STRUCTURE>, JsonSchemaProducer {
    private readonly jsonSchema?;
    constructor(jsonSchema?: unknown);
    validate(data: unknown): {
        success: true;
        data: STRUCTURE;
    } | {
        success: false;
        error: unknown;
    };
    getJsonSchema(): unknown;
    readonly _type: STRUCTURE;
}
