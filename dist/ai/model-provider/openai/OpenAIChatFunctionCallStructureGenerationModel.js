import SecureJSON from "secure-json-parse";
import { StructureParseError } from "../../model-function/generate-structure/StructureParseError.js";
import { parsePartialJson } from "../../model-function/generate-structure/parsePartialJson.js";
import { OpenAIChatResponseFormat, } from "./AbstractOpenAIChatModel.js";
import { chat, instruction, text } from "./OpenAIChatPromptTemplate.js";
export class OpenAIChatFunctionCallStructureGenerationModel {
    constructor({ model, fnName, fnDescription, promptTemplate, }) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fnName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fnDescription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "promptTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = model;
        this.fnName = fnName;
        this.fnDescription = fnDescription;
        this.promptTemplate = promptTemplate;
    }
    get modelInformation() {
        return this.model.modelInformation;
    }
    get settings() {
        return {
            ...this.model.settings,
            fnName: this.fnName,
            fnDescription: this.fnDescription,
        };
    }
    get settingsForEvent() {
        return {
            ...this.model.settingsForEvent,
            fnName: this.fnName,
            fnDescription: this.fnDescription,
        };
    }
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt() {
        return this.withPromptTemplate(text());
    }
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt() {
        return this.withPromptTemplate(instruction());
    }
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt() {
        return this.withPromptTemplate(chat());
    }
    withPromptTemplate(promptTemplate) {
        return new OpenAIChatFunctionCallStructureGenerationModel({
            model: this.model,
            fnName: this.fnName,
            fnDescription: this.fnDescription,
            promptTemplate,
        });
    }
    withSettings(additionalSettings) {
        return new OpenAIChatFunctionCallStructureGenerationModel({
            model: this.model.withSettings(additionalSettings),
            fnName: this.fnName,
            fnDescription: this.fnDescription,
            promptTemplate: this.promptTemplate,
        });
    }
    /**
     * JSON generation uses the OpenAI GPT function calling API.
     * It provides a single function specification and instructs the model to provide parameters for calling the function.
     * The result is returned as parsed JSON.
     *
     * @see https://platform.openai.com/docs/guides/gpt/function-calling
     */
    async doGenerateStructure(schema, prompt, // first argument of the function
    options) {
        const expandedPrompt = this.promptTemplate.format(prompt);
        const rawResponse = await this.model
            .withSettings({
            stopSequences: [
                ...(this.settings.stopSequences ?? []),
                ...this.promptTemplate.stopSequences,
            ],
        })
            .callAPI(expandedPrompt, options, {
            responseFormat: OpenAIChatResponseFormat.json,
            functionCall: { name: this.fnName },
            functions: [
                {
                    name: this.fnName,
                    description: this.fnDescription,
                    parameters: schema.getJsonSchema(),
                },
            ],
        });
        const valueText = rawResponse.choices[0].message.function_call.arguments;
        try {
            return {
                rawResponse,
                valueText,
                value: SecureJSON.parse(valueText),
                usage: this.model.extractUsage(rawResponse),
            };
        }
        catch (error) {
            throw new StructureParseError({
                valueText,
                cause: error,
            });
        }
    }
    async doStreamStructure(schema, prompt, // first argument of the function
    options) {
        const expandedPrompt = this.promptTemplate.format(prompt);
        return this.model.callAPI(expandedPrompt, options, {
            responseFormat: OpenAIChatResponseFormat.deltaIterable,
            functionCall: { name: this.fnName },
            functions: [
                {
                    name: this.fnName,
                    description: this.fnDescription,
                    parameters: schema.getJsonSchema(),
                },
            ],
        });
    }
    extractStructureTextDelta(delta) {
        const chunk = delta;
        if (chunk.object !== "chat.completion.chunk") {
            return undefined;
        }
        const chatChunk = chunk;
        const firstChoice = chatChunk.choices[0];
        if (firstChoice.index > 0) {
            return undefined;
        }
        return firstChoice.delta.function_call?.arguments;
    }
    parseAccumulatedStructureText(accumulatedText) {
        return parsePartialJson(accumulatedText);
    }
}
