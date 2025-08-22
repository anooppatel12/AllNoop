'use server';
/**
 * @fileOverview An AI agent for analyzing keywords for SEO purposes.
 *
 * - analyzeKeyword - A function that handles the keyword analysis process.
 * - AnalyzeKeywordInput - The input type for the analyzeKeyword function.
 * - AnalyzeKeywordOutput - The return type for the analyzeKeyword function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeKeywordInputSchema = z.object({
  keyword: z.string().describe('The keyword or hashtag to analyze.'),
});
export type AnalyzeKeywordInput = z.infer<typeof AnalyzeKeywordInputSchema>;

const AnalyzeKeywordOutputSchema = z.object({
  searchVolume: z.string().describe('Estimated search volume (e.g., High, Medium, Low).'),
  competition: z.string().describe('Estimated competition level (e.g., High, Medium, Low).'),
  relatedKeywords: z.array(z.string()).describe('A list of related keywords or hashtags.'),
  contentIdeas: z.array(z.string()).describe('A list of content ideas based on the keyword.'),
});
export type AnalyzeKeywordOutput = z.infer<typeof AnalyzeKeywordOutputSchema>;

export async function analyzeKeyword(input: AnalyzeKeywordInput): Promise<AnalyzeKeywordOutput> {
  return analyzeKeywordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeKeywordPrompt',
  input: { schema: AnalyzeKeywordInputSchema },
  output: { schema: AnalyzeKeywordOutputSchema },
  prompt: `You are an SEO and social media expert. Analyze the following keyword/hashtag: {{{keyword}}}.

Provide an analysis with the following fields:
- searchVolume: An estimation of the search volume (High, Medium, or Low).
- competition: An estimation of the competition level (High, Medium, or Low).
- relatedKeywords: A list of 5-10 closely related keywords or hashtags.
- contentIdeas: A list of 3-5 engaging content ideas (e.g., blog post titles, video ideas) for this keyword.`,
});

const analyzeKeywordFlow = ai.defineFlow(
  {
    name: 'analyzeKeywordFlow',
    inputSchema: AnalyzeKeywordInputSchema,
    outputSchema: AnalyzeKeywordOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
