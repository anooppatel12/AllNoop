'use server';
/**
 * @fileOverview An AI agent that generates smart notes from a meeting transcript.
 *
 * - generateSmartNotes - A function that handles the note generation process.
 * - GenerateSmartNotesInput - The input type for the generateSmartNotes function.
 * - GenerateSmartNotesOutput - The return type for the generateSmartNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSmartNotesInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the meeting, including speaker names if available.'),
});
export type GenerateSmartNotesInput = z.infer<typeof GenerateSmartNotesInputSchema>;

const GenerateSmartNotesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the entire meeting.'),
  keyPoints: z.array(z.string()).describe('A bulleted list of the most important points, decisions, or questions.'),
  actionItems: z.array(z.string()).describe('A bulleted list of actionable tasks, including who is assigned to them if mentioned.'),
});
export type GenerateSmartNotesOutput = z.infer<typeof GenerateSmartNotesOutputSchema>;

export async function generateSmartNotes(input: GenerateSmartNotesInput): Promise<GenerateSmartNotesOutput> {
  return generateSmartNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartNotesPrompt',
  input: { schema: GenerateSmartNotesInputSchema },
  output: { schema: GenerateSmartNotesOutputSchema },
  prompt: `You are an expert meeting assistant. Analyze the following meeting transcript and generate a set of "Smart Notes".

Transcript:
{{{transcript}}}

Based on the transcript, provide the following:
1.  **summary**: A brief, neutral summary of the meeting's purpose and key discussions.
2.  **keyPoints**: A list of the most important decisions, conclusions, and significant questions raised.
3.  **actionItems**: A list of all assigned tasks or action items. If a person is assigned, please mention them. If no action items are present, return an empty array.`,
});

const generateSmartNotesFlow = ai.defineFlow(
  {
    name: 'generateSmartNotesFlow',
    inputSchema: GenerateSmartNotesInputSchema,
    outputSchema: GenerateSmartNotesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
