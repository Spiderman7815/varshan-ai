import {genkit, GenerationRequest, ModelAction, Model} from 'genkit';
import {googleAI, GoogleAIGeminiModel} from '@genkit-ai/google-genai';
import {z} from 'zod';

const apiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter((k): k is string => !!k);

let currentKeyIndex = 0;

function createResilientModel(model: Model<z.ZodType, z.ZodType>): ModelAction {
  const resilientModel: ModelAction = async (
    request: GenerationRequest,
    streamingCallback?: (chunk: any) => void
  ) => {
    let attempts = 0;
    while (attempts < apiKeys.length) {
      try {
        const key = apiKeys[currentKeyIndex];
        const client = googleAI({apiKey: key});
        const modelInstance = client.model(model.name) as GoogleAIGeminiModel;

        const result = await modelInstance.generate(request, streamingCallback);
        return result;
      } catch (error) {
        console.warn(
          `API call with key index ${currentKeyIndex} failed.`,
          error
        );
        attempts++;
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        if (attempts >= apiKeys.length) {
          console.error('All API keys failed.');
          throw new Error('All API keys failed to generate a response.');
        }
      }
    }
    throw new Error('Failed to generate response after all retries.');
  };
  return resilientModel;
}

const originalModel = googleAI.model('gemini-2.5-flash');

export const ai = genkit({
  plugins: [],
  model: {
    ...originalModel,
    generate: createResilientModel(originalModel),
  },
});
