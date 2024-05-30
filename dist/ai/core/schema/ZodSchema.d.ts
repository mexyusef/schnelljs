import { z } from "zod";
import { JsonSchemaProducer } from "./JsonSchemaProducer.js";
import { Schema } from "./Schema.js";
export declare function zodSchema<STRUCTURE>(zodSchema: z.Schema<STRUCTURE>): ZodSchema<STRUCTURE>;
export declare class ZodSchema<STRUCTURE> implements Schema<STRUCTURE>, JsonSchemaProducer {
    readonly zodSchema: z.Schema<STRUCTURE>;
    constructor(zodSchema: z.Schema<STRUCTURE>);
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
