'use server';

import {
  generateTrendingHashtags,
} from '@/ai/flows/generate-trending-hashtags';
import {
  generateSocialMediaCaptions,
} from '@/ai/flows/generate-social-media-captions';

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
