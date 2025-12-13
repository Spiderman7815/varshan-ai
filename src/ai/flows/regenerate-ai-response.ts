// Regenerate AI response flow using a given prompt.
'use server';
/**
 * @fileOverview A flow to regenerate an AI response based on a given prompt.
 *
 * - regenerateAiResponse - A function that regenerates the AI response.
 * - RegenerateAiResponseInput - The input type for the regenerateAiResponse function.
 * - RegenerateAiResponseOutput - The return type for the regenerateAiResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateAiResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt to regenerate the AI response for.'),
});
export type RegenerateAiResponseInput = z.infer<typeof RegenerateAiResponseInputSchema>;

const RegenerateAiResponseOutputSchema = z.object({
  response: z.string().describe('The regenerated AI response.'),
});
export type RegenerateAiResponseOutput = z.infer<typeof RegenerateAiResponseOutputSchema>;

export async function regenerateAiResponse(input: RegenerateAiResponseInput): Promise<RegenerateAiResponseOutput> {
  return regenerateAiResponseFlow(input);
}

const regenerateAiResponsePrompt = ai.definePrompt({
  name: 'regenerateAiResponsePrompt',
  input: {schema: RegenerateAiResponseInputSchema},
  output: {schema: RegenerateAiResponseOutputSchema},
  prompt: `Regenerate the AI response for the following prompt: {{{prompt}}}`,
});

const regenerateAiResponseFlow = ai.defineFlow(
  {
    name: 'regenerateAiResponseFlow',
    inputSchema: RegenerateAiResponseInputSchema,
    outputSchema: RegenerateAiResponseOutputSchema,
  },
  async input => {
    const {output} = await regenerateAiResponsePrompt(input);
    return output!;
  }
);
