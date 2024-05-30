import { nanoid } from "nanoid";
import { parseJSON } from "../../core/schema/parseJSON.js";
export const jsonToolCallPrompt = {
    text() {
        return {
            createPrompt(instruction, tool) {
                return {
                    system: [
                        `You are calling a function "${tool.name}".`,
                        tool.description != null
                            ? `  Function description: ${tool.description}`
                            : null,
                        `  Function parameters JSON schema: ${JSON.stringify(tool.parameters.getJsonSchema())}`,
                        ``,
                        `You MUST answer with a JSON object matches the above schema for the arguments.`,
                    ]
                        .filter(Boolean)
                        .join("\n"),
                    instruction,
                };
            },
            extractToolCall(response) {
                return { id: nanoid(), args: parseJSON({ text: response }) };
            },
        };
    },
};
