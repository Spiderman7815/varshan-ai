'use server';
/**
 * @fileOverview A flow to generate an AI response for a chat conversation.
 *
 * - chat - The main function that generates the AI response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {generateImage} from '@/ai/flows/generate-image-flow';
import {z} from 'genkit';

async function tavilySearch(input: {
  query: string;
}): Promise<{results: any[]}> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Tavily API key is not configured. Please set TAVILY_API_KEY environment variable.'
    );
  }
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      q: input.query,
      search_depth: 'basic',
      include_answer: false,
      include_images: false,
      max_results: 5,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Tavily search failed with status ${response.status}: ${await response.text()}`
    );
  }
  return response.json();
}

const webSearchTool = ai.defineTool(
  {
    name: 'webSearch',
    description:
      'Search the web for information. Useful for current events or topics the AI is not trained on.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.any(),
  },
  tavilySearch
);

const imageGenerationTool = ai.defineTool(
  {
    name: 'imageGeneration',
    description:
      'Generate an image from a text description. Use this when the user asks for an image, a picture, a drawing, etc.',
    inputSchema: z.object({
      prompt: z.string().describe('The text description of the image to generate.'),
    }),
    outputSchema: z.object({
      imageUrl: z.string().describe('The URL of the generated image.'),
    }),
  },
  async input => {
    const {imageUrl} = await generateImage(input);
    return {imageUrl};
  }
);

const ChatInputSchema = z.object({
  prompt: z.string().describe('The user prompt to generate the AI response for.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The generated AI response.').optional(),
  imageUrl: z.string().describe('The URL of a generated image, if any.').optional(),
  toolUsed: z.string().describe('The name of the tool used, if any.').optional(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {
    schema: z.object({
      response: z.string().describe('The generated AI response.'),
    }),
  },
  prompt: `You are a helpful AI assistant named VarshanAI. Respond to the following prompt: {{{prompt}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/gemini-2.5-flash',
      tools: [webSearchTool, imageGenerationTool],
    });

    const choice = llmResponse.choices[0];
    
    // If the model chose to call a tool
    if (choice && choice.toolCalls) {
        const toolCall = choice.toolCalls[0];
        const toolResponse = await toolCall.run();
        
        if (toolCall.tool.name === 'imageGeneration') {
            return {
                imageUrl: toolResponse.imageUrl,
                toolUsed: 'imageGeneration',
            };
        }
        
        // For web search, we send the result back to the LLM to get a final answer
        const finalResponse = await ai.generate({
            prompt: [
                {role: 'user', content: [{text: input.prompt}]},
                {role: 'model', content: [choice]},
                {role: 'tool', content: [toolCall]},
            ],
            model: 'googleai/gemini-2.5-flash',
        });

        return {
            response: finalResponse.text,
            toolUsed: 'webSearch',
        };
    }

    // If no tool was called, just return the text response
    return { response: llmResponse.text };
  }
);
