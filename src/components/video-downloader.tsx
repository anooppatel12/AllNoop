
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Link as LinkIcon, Loader2, Youtube, Instagram, Facebook, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Platform = 'youtube' | 'instagram' | 'facebook';

interface DownloadResult {
  thumbnail: string;
  title: string;
  formats: {
    qualityLabel: string;
    itag: number;
    container: string;
    hasVideo: boolean;
    hasAudio: boolean;
    contentLength?: string;
    url?: string;
  }[];
}

export function VideoDownloader() {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchVideo = async () => {
    if (!url) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    if (platform !== 'youtube') {
      setError('Sorry, only YouTube downloads are supported at this time.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch video information.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setUrl('');
    setResult(null);
    setError(null);
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
  
  const handleDownload = (itag: number, title: string, container: string) => {
      window.location.href = `/api/download?url=${encodeURIComponent(url)}&itag=${itag}&title=${encodeURIComponent(title)}&container=${container}`;
  }

  return (
    <Card className="mt-8 w-full">
        <Tabs value={platform} onValueChange={handlePlatformChange} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="youtube">{platformIcons['youtube']} YouTube</TabsTrigger>
                <TabsTrigger value="instagram" disabled>{platformIcons['instagram']} Instagram</TabsTrigger>
                <TabsTrigger value="facebook" disabled>{platformIcons['facebook']} Facebook</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                             <Button 
                                key={format.itag} 
                                variant="outline" 
                                onClick={() => handleDownload(format.itag, result.title, format.container)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                <div>
                                    <p>{format.qualityLabel}</p>
                                    {format.contentLength && 
                                        <p className="text-xs text-muted-foreground">
                                            {(parseInt(format.contentLength) / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    }
                                </div>
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
