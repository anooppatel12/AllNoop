'use server';

import {
  generateTrendingHashtags,
} from '@/ai/flows/generate-trending-hashtags';
import {
  generateSocialMediaCaptions,
} from '@/ai/flows/generate-social-media-captions';
import {
  removeImageBackground,
  type RemoveImageBackgroundInput,
} from '@/ai/flows/remove-image-background';
import {
  replaceImageBackground,
  type ReplaceImageBackgroundInput,
} from '@/ai/flows/replace-image-background';


export async function generateHashtags(topic: string) {
  try {
    const result = await generateTrendingHashtags({ topic });
    return { hashtags: result.hashtags };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate hashtags. Please try again.' };
  }
}

export async function generateCaptions(topic: string) {
  try {
    const result = await generateSocialMediaCaptions({ topic });
    return { captions: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate captions. Please try again.' };
  }
}

export async function removeImageBackgroundAction(image: string) {
  try {
    const result = await removeImageBackground({ image });
    return { image: result.image };
  } catch (e: any) {
    console.error('Error removing background', e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function replaceImageBackgroundAction(input: ReplaceImageBackgroundInput) {
  try {
    const result = await replaceImageBackground(input);
    return { image: result.image };
  } catch (e: any) {
    console.error('Error replacing background', e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
