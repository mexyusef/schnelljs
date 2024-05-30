export class LoadAPIKeyError extends Error {
    constructor({ message }) {
        super(message);
        this.name = "LoadAPIKeyError";
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
        };
    }
}
