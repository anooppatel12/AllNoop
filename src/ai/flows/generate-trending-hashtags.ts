'use server';

/**
 * @fileOverview A flow that generates trending hashtags based on a topic or keyword.
 *
 * - generateTrendingHashtags - A function that generates trending hashtags.
 * - GenerateTrendingHashtagsInput - The input type for the generateTrendingHashtags function.
 * - GenerateTrendingHashtagsOutput - The return type for the generateTrendingHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTrendingHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to generate hashtags for.'),
});

export type GenerateTrendingHashtagsInput = z.infer<typeof GenerateTrendingHashtagsInputSchema>;

const GenerateTrendingHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of trending hashtags related to the topic.'),
});

export type GenerateTrendingHashtagsOutput = z.infer<typeof GenerateTrendingHashtagsOutputSchema>;

export async function generateTrendingHashtags(input: GenerateTrendingHashtagsInput): Promise<GenerateTrendingHashtagsOutput> {
  return generateTrendingHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrendingHashtagsPrompt',
  input: {schema: GenerateTrendingHashtagsInputSchema},
  output: {schema: GenerateTrendingHashtagsOutputSchema},
  prompt: `You are a social media expert. Generate a list of trending hashtags for the following topic: {{{topic}}}.  Return no more than 20 hashtags.

      The hashtags should be relevant and popular on platforms like Instagram, TikTok, and Twitter.
      The hashtags should be returned as a JSON array of strings.`,
});

const generateTrendingHashtagsFlow = ai.defineFlow(
  {
    name: 'generateTrendingHashtagsFlow',
    inputSchema: GenerateTrendingHashtagsInputSchema,
    outputSchema: GenerateTrendingHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
