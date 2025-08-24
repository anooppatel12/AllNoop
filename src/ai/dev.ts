'use server';
/**
 * @fileOverview A development file for registering Genkit flows.
 *
 * This file is responsible for importing and registering all the Genkit flows
 * that are used in the application during development.
 */

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-trending-hashtags.ts';
import '@/ai/flows/generate-social-media-captions.ts';
import '@/ai/flows/remove-image-background.ts';
import '@/ai/flows/replace-image-background.ts';
import '@/ai/flows/generate-quote.ts';
import '@/ai/flows/analyze-keyword.ts';
import '@/ai/flows/generate-smart-notes.ts';
