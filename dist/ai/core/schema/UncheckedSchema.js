export function uncheckedSchema(jsonSchema) {
    return new UncheckedSchema(jsonSchema);
}
export class UncheckedSchema {
    constructor(jsonSchema) {
        Object.defineProperty(this, "jsonSchema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jsonSchema
        });
        Object.defineProperty(this, "_type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    validate(data) {
        return { success: true, data: data };
    }
    getJsonSchema() {
        return this.jsonSchema;
    }
}
