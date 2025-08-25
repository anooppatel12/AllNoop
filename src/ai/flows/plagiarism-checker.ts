'use server';
/**
 * @fileOverview An AI agent for checking plagiarism in a given text.
 *
 * - checkPlagiarism - A function that handles the plagiarism checking process.
 * - PlagiarismInput - The input type for the checkPlagiarism function.
 * - PlagiarismOutput - The return type for the checkPlagiarism function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PlagiarismInputSchema = z.object({
  text: z.string().describe('The text content to check for plagiarism.'),
});
export type PlagiarismInput = z.infer<typeof PlagiarismInputSchema>;

const PlagiarismOutputSchema = z.object({
  uniquePercentage: z.number().describe('The percentage of content that is unique.'),
  plagiarizedPercentage: z.number().describe('The percentage of content that is plagiarized.'),
  sentences: z.array(z.object({
    text: z.string().describe('The sentence from the original text.'),
    isPlagiarized: z.boolean().describe('Whether the sentence is considered plagiarized.'),
  })).describe('An array of sentences with their plagiarism status.'),
});
export type PlagiarismOutput = z.infer<typeof PlagiarismOutputSchema>;

export async function checkPlagiarism(input: PlagiarismInput): Promise<PlagiarismOutput> {
  return plagiarismCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'plagiarismCheckerPrompt',
  input: { schema: PlagiarismInputSchema },
  output: { schema: PlagiarismOutputSchema },
  prompt: `You are a highly advanced plagiarism detection AI.
Your task is to analyze the provided text and identify sentences that are likely unoriginal or plagiarized from common sources on the internet, books, or academic papers.

Analyze the following text:
"{{{text}}}"

Break the text down into individual sentences. For each sentence, determine if it is original or potentially plagiarized.
Common phrases, idioms, or very generic statements should be considered unique unless they form a longer, specific, and unoriginal thought.

Based on your analysis, calculate the overall percentage of unique and plagiarized content based on the number of sentences.

Return the result in the specified JSON format, providing the unique percentage, plagiarized percentage, and an array of all sentences, each with its plagiarism status.
A sentence is plagiarized if it is a direct copy or very close paraphrase of a known source.
`,
});

const plagiarismCheckerFlow = ai.defineFlow(
  {
    name: 'plagiarismCheckerFlow',
    inputSchema: PlagiarismInputSchema,
    outputSchema: PlagiarismOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
