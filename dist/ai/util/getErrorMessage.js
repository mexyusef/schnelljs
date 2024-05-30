export function getErrorMessage(error) {
    if (error == null) {
        return "unknown error";
    }
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return JSON.stringify(error);
}
