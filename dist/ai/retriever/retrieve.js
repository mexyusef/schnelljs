import { executeFunctionCall } from "../core/executeFunctionCall.js";
export async function retrieve(retriever, query, options) {
    return executeFunctionCall({
        options,
        input: query,
        functionType: "retrieve",
        execute: (options) => retriever.retrieve(query, options),
        inputPropertyName: "query",
        outputPropertyName: "results",
    });
}
