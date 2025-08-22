'use server';
/**
 * @fileOverview A flow that generates a random inspirational quote.
 *
 * - generateQuote - A function that generates a random quote.
 * - GenerateQuoteOutput - The return type for the generateQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteOutputSchema = z.object({
  content: z.string().describe('The content of the quote.'),
  author: z.string().describe('The author of the quote. If the author is unknown or it is a proverb, use "Anonymous".'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;

export async function generateQuote(): Promise<GenerateQuoteOutput> {
  return generateQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'generateQuotePrompt',
  output: {schema: GenerateQuoteOutputSchema},
  prompt: `You are an expert at generating inspirational and thought-provoking quotes.
Generate a single, unique, and insightful quote.
The quote should be concise and memorable.
Provide an author for the quote. If you are generating a new quote, you can attribute it to "Anonymous" or a fictional philosopher.`,
});

const generateQuoteFlow = ai.defineFlow(
  {
    name: 'generateQuoteFlow',
    outputSchema: GenerateQuoteOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
