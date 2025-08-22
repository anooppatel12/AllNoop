
import type { Metadata } from 'next';
import { HashtagGeneratorClient } from '@/components/hashtag-generator-client';

export const metadata: Metadata = {
    title: 'AI Hashtag & Caption Generator',
    description: 'Instantly generate trending hashtags and engaging social media captions for any topic. Boost your online presence with our free AI-powered tool.',
};

export default function HashtagGeneratorPage() {
    return <HashtagGeneratorClient />;
}
