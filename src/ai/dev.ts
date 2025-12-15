import { config } from 'dotenv';
config();

import '@/ai/flows/generate-chat-title.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
