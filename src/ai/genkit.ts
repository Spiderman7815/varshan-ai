'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const apiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter((k): k is string => !!k);

if (apiKeys.length === 0) {
  console.warn("No Gemini API keys found. Please set GEMINI_API_KEY in your .env file.");
}

export const ai = genkit({
  plugins: [googleAI({apiKeys, strategy: 'round-robin'})],
});
