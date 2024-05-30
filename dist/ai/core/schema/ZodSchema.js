import { zodToJsonSchema } from "zod-to-json-schema";
export function zodSchema(zodSchema) {
    return new ZodSchema(zodSchema);
}
export class ZodSchema {
    constructor(zodSchema) {
        Object.defineProperty(this, "zodSchema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zodSchema = zodSchema;
    }
    validate(data) {
        return this.zodSchema.safeParse(data);
    }
    getJsonSchema() {
        return zodToJsonSchema(this.zodSchema);
    }
}
