import { config } from 'dotenv';
config();

import '@/ai/flows/generate-trending-hashtags.ts';
import '@/ai/flows/generate-social-media-captions.ts';
import '@/ai/flows/remove-image-background.ts';
import '@/ai/flows/replace-image-background.ts';
