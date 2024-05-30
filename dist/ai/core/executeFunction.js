import { executeFunctionCall } from "./executeFunctionCall.js";
export async function executeFunction(fn, input, options) {
    return executeFunctionCall({
        options,
        input,
        functionType: "execute-function",
        execute: async (options) => fn(input, options),
    });
}
