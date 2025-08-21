'use server';
/**
 * @fileOverview An AI agent that removes the background from an image.
 *
 * - removeImageBackground - Removes the background from an image.
 * - RemoveImageBackgroundInput - The input type for the removeImageBackground function.
 * - RemoveImageBackgroundOutput - The return type for the removeImageBackground function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveImageBackgroundInputSchema = z.object({
  image: z.string().describe("A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type RemoveImageBackgroundInput = z.infer<typeof RemoveImageBackgroundInputSchema>;

const RemoveImageBackgroundOutputSchema = z.object({
  image: z.string().describe('The generated image with the background removed, as a data URI.'),
});
export type RemoveImageBackgroundOutput = z.infer<typeof RemoveImageBackgroundOutputSchema>;

export async function removeImageBackground(input: RemoveImageBackgroundInput): Promise<RemoveImageBackgroundOutput> {
  return removeImageBackgroundFlow(input);
}

const removeImageBackgroundFlow = ai.defineFlow(
  {
    name: 'removeImageBackgroundFlow',
    inputSchema: RemoveImageBackgroundInputSchema,
    outputSchema: RemoveImageBackgroundOutputSchema,
  },
  async ({image}) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [{
            media: { url: image },
        }, {
            text: 'Segment the main subject from the background. Make the background transparent.'
        }],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    return {image: media.url};
  }
);
