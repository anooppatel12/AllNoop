
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Link as LinkIcon, Loader2, Youtube, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

type Platform = 'youtube' | 'instagram' | 'facebook';

interface DownloadResult {
  thumbnail: string;
  title: string;
  formats: {
    quality: string;
    url: string;
    size?: string;
  }[];
}

// Mock data to simulate API response
const mockData: { [key in Platform]: DownloadResult } = {
  youtube: {
    thumbnail: 'https://placehold.co/600x400.png',
    title: 'Sample YouTube Video Title',
    formats: [
      { quality: '1080p', url: '#', size: '50 MB' },
      { quality: '720p', url: '#', size: '35 MB' },
      { quality: '480p', url: '#', size: '20 MB' },
      { quality: 'MP3', url: '#', size: '5 MB' },
    ],
  },
  instagram: {
    thumbnail: 'https://placehold.co/400x400.png',
    title: 'Sample Instagram Reel',
    formats: [
      { quality: '1080p', url: '#', size: '15 MB' },
      { quality: '720p', url: '#', size: '10 MB' },
    ],
  },
  facebook: {
    thumbnail: 'https://placehold.co/600x315.png',
    title: 'Sample Facebook Video',
    formats: [
      { quality: 'HD', url: '#', size: '40 MB' },
      { quality: 'SD', url: '#', size: '25 MB' },
    ],
  },
};

export function VideoDownloader() {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);

  const handleFetchVideo = () => {
    if (!url) return;
    setIsLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult(mockData[platform]);
      setIsLoading(false);
    }, 2000);
  };

  const reset = () => {
    setUrl('');
    setResult(null);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value as Platform);
    reset();
  }

  const platformIcons = {
    youtube: <Youtube className="mr-2 h-5 w-5 text-red-600" />,
    instagram: <Instagram className="mr-2 h-5 w-5 text-pink-500" />,
    facebook: <Facebook className="mr-2 h-5 w-5 text-blue-600" />,
  };

  return (
    <Card className="mt-8 w-full">
        <Tabs value={platform} onValueChange={handlePlatformChange} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="youtube">{platformIcons['youtube']} YouTube</TabsTrigger>
                <TabsTrigger value="instagram">{platformIcons['instagram']} Instagram</TabsTrigger>
                <TabsTrigger value="facebook">{platformIcons['facebook']} Facebook</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        id="video-url" 
                        placeholder={`Paste a ${platform} URL`} 
                        className="pl-10"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
            </div>
             <Button onClick={handleFetchVideo} disabled={isLoading || !url} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Video...
                </>
              ) : (
                'Fetch Video'
              )}
            </Button>
          </CardContent>
        </Tabs>
      {result && (
        <CardFooter className="flex flex-col rounded-b-lg bg-muted p-6">
            <div className="flex w-full flex-col gap-4 sm:flex-row">
                <Image
                    src={result.thumbnail}
                    alt={result.title}
                    width={200}
                    height={112}
                    className="rounded-lg object-cover"
                    data-ai-hint="video thumbnail"
                />
                <div className="flex-1 space-y-2">
                    <p className="font-semibold">{result.title}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {result.formats.map((format) => (
                            <Button key={format.quality} variant="outline" asChild>
                                <a href={format.url}>
                                    <Download className="mr-2 h-4 w-4" />
                                    <div>
                                        <p>{format.quality}</p>
                                        {format.size && <p className="text-xs text-muted-foreground">{format.size}</p>}
                                    </div>
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
