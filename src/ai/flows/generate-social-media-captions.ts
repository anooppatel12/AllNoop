'use server';
/**
 * @fileOverview A social media caption generator AI agent.
 *
 * - generateSocialMediaCaptions - A function that handles the caption generation process.
 * - GenerateSocialMediaCaptionsInput - The input type for the generateSocialMediaCaptions function.
 * - GenerateSocialMediaCaptionsOutput - The return type for the generateSocialMediaCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic or keyword for generating captions.'),
});
export type GenerateSocialMediaCaptionsInput = z.infer<typeof GenerateSocialMediaCaptionsInputSchema>;

const GenerateSocialMediaCaptionsOutputSchema = z.object({
  instagramReelsCaption: z.string().describe('The generated caption for Instagram Reels.'),
  tiktokCaption: z.string().describe('The generated caption for TikTok.'),
  youtubeShortsDescription: z.string().describe('The generated description for YouTube Shorts.'),
});
export type GenerateSocialMediaCaptionsOutput = z.infer<typeof GenerateSocialMediaCaptionsOutputSchema>;

export async function generateSocialMediaCaptions(input: GenerateSocialMediaCaptionsInput): Promise<GenerateSocialMediaCaptionsOutput> {
  return generateSocialMediaCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaCaptionsPrompt',
  input: {schema: GenerateSocialMediaCaptionsInputSchema},
  output: {schema: GenerateSocialMediaCaptionsOutputSchema},
  prompt: `You are a social media expert. Generate engaging captions for Instagram Reels, TikTok, and YouTube Shorts based on the given topic or keyword.\n\nTopic/Keyword: {{{topic}}}\n\nInstagram Reels Caption:\nTikTok Caption:\nYouTube Shorts Description:`, //Crucially, you MUST NOT attempt to directly call functions, use await keywords, or perform any complex logic _within_ the Handlebars template string.
});

const generateSocialMediaCaptionsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaCaptionsFlow',
    inputSchema: GenerateSocialMediaCaptionsInputSchema,
    outputSchema: GenerateSocialMediaCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
