'use server';
/**
 * @fileOverview An AI agent that replaces the background of an image based on a prompt.
 *
 * - replaceImageBackground - Replaces the background of an image.
 * - ReplaceImageBackgroundInput - The input type for the replaceImageBackground function.
 * - ReplaceImageBackgroundOutput - The return type for the replaceImageBackground function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReplaceImageBackgroundInputSchema = z.object({
  image: z.string().describe("A photo of an object with a transparent background, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  prompt: z.string().describe('A description of the new background to generate.')
});
export type ReplaceImageBackgroundInput = z.infer<typeof ReplaceImageBackgroundInputSchema>;

const ReplaceImageBackgroundOutputSchema = z.object({
  image: z.string().describe('The generated image with the new background, as a data URI.'),
});
export type ReplaceImageBackgroundOutput = z.infer<typeof ReplaceImageBackgroundOutputSchema>;

export async function replaceImageBackground(input: ReplaceImageBackgroundInput): Promise<ReplaceImageBackgroundOutput> {
  return replaceImageBackgroundFlow(input);
}

const replaceImageBackgroundFlow = ai.defineFlow(
  {
    name: 'replaceImageBackgroundFlow',
    inputSchema: ReplaceImageBackgroundInputSchema,
    outputSchema: ReplaceImageBackgroundOutputSchema,
  },
  async ({image, prompt}) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [{
            media: { url: image },
        }, {
            text: `generate a new background for this image based on the following prompt: ${prompt}`
        }],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    return {image: media.url};
  }
);
