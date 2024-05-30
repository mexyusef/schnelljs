import { PartialBaseUrlPartsApiConfigurationOptions } from "../../core/api/BaseUrlApiConfiguration.js";
import { AzureOpenAIApiConfiguration, AzureOpenAIApiConfigurationOptions } from "./AzureOpenAIApiConfiguration.js";
import { OpenAIApiConfiguration } from "./OpenAIApiConfiguration.js";
import { OpenAIChatModel, OpenAIChatSettings } from "./OpenAIChatModel.js";
import { OpenAICompletionModel, OpenAICompletionModelSettings } from "./OpenAICompletionModel.js";
import { OpenAIImageGenerationModel, OpenAIImageGenerationSettings } from "./OpenAIImageGenerationModel.js";
import { OpenAISpeechModel, OpenAISpeechModelSettings } from "./OpenAISpeechModel.js";
import { OpenAITextEmbeddingModel, OpenAITextEmbeddingModelSettings } from "./OpenAITextEmbeddingModel.js";
import { OpenAITranscriptionModel, OpenAITranscriptionModelSettings } from "./OpenAITranscriptionModel.js";
import { TikTokenTokenizer, TikTokenTokenizerSettings } from "./TikTokenTokenizer.js";
/**
 * Creates an API configuration for the OpenAI API.
 * It calls the API at https://api.openai.com/v1 and uses the `OPENAI_API_KEY` env variable by default.
 */
export declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): OpenAIApiConfiguration;
/**
 * Configuration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
export declare function AzureApi(settings: AzureOpenAIApiConfigurationOptions): AzureOpenAIApiConfiguration;
/**
 * Create a text generation model that calls the OpenAI text completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 *
 * @example
 * const model = openai.CompletionTextGenerator({
 *   model: "gpt-3.5-turbo-instruct",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 *
 * @return A new instance of {@link OpenAICompletionModel}.
 */
export declare function CompletionTextGenerator(settings: OpenAICompletionModelSettings): OpenAICompletionModel;
/**
 * Create a text generation model that calls the OpenAI chat completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * const model = openai.ChatTextGenerator({
 *   model: "gpt-3.5-turbo",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText(
 *   model,
 *   [
 *     openai.ChatMessage.system(
 *       "Write a short story about a robot learning to love:"
 *     ),
 *   ]
 * );
 */
export declare function ChatTextGenerator(settings: OpenAIChatSettings): OpenAIChatModel;
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany(
 *   openai.TextEmbedder({ model: "text-embedding-ada-002" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 *
 * @returns A new instance of {@link OpenAITextEmbeddingModel}.
 */
export declare function TextEmbedder(settings: OpenAITextEmbeddingModelSettings): OpenAITextEmbeddingModel;
/**
 * Synthesize speech using the OpenAI API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/createSpeech
 *
 * @returns A new instance of {@link OpenAISpeechModel}.
 */
export declare function SpeechGenerator(settings: OpenAISpeechModelSettings): OpenAISpeechModel;
/**
 * Create a transcription model that calls the OpenAI transcription API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/create
 *
 * @example
 * const data = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await transcribe(
 *   openai.Transcriber({ model: "whisper-1" }),
 *   {
 *     type: "mp3",
 *     data,
 *   }
 * );
 *
 * @returns A new instance of {@link OpenAITranscriptionModel}.
 */
export declare function Transcriber(settings: OpenAITranscriptionModelSettings): OpenAITranscriptionModel;
/**
 * Create an image generation model that calls the OpenAI AI image creation API.
 *
 * @see https://platform.openai.com/docs/api-reference/images/create
 *
 * @example
 * const image = await generateImage(
 *   new OpenAIImageGenerationModel({ size: "512x512" }),
 *   "the wicked witch of the west in the style of early 19th century painting"
 * );
 *
 * @returns A new instance of {@link OpenAIImageGenerationModel}.
 */
export declare function ImageGenerator(settings: OpenAIImageGenerationSettings): OpenAIImageGenerationModel;
/**
 * Creates a TikToken tokenizer for OpenAI language models.
 *
 * @see https://github.com/openai/tiktoken
 *
 * @example
 * const tokenizer = openai.Tokenizer({ model: "gpt-4" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 *
 * @returns A new instance of {@link TikTokenTokenizer}.
 */
export declare function Tokenizer(settings: TikTokenTokenizerSettings): TikTokenTokenizer;
export { OpenAIChatPrompt as ChatPrompt } from "./AbstractOpenAIChatModel.js";
export { OpenAIChatMessage as ChatMessage } from "./OpenAIChatMessage.js";
