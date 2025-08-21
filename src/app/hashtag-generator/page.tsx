'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateCaptions, generateHashtags } from '../actions';
import type { GenerateSocialMediaCaptionsOutput } from '@/ai/flows/generate-social-media-captions';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
});

type CopyState = { [key: string]: boolean };

export default function HashtagGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [captions, setCaptions] = useState<GenerateSocialMediaCaptionsOutput | null>(null);
  const [copyState, setCopyState] = useState<CopyState>({});

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setHashtags([]);
    setCaptions(null);

    const hashtagResult = await generateHashtags(data.topic);
    if (hashtagResult.error) {
      toast({ variant: 'destructive', title: 'Error', description: hashtagResult.error });
    } else {
      setHashtags(hashtagResult.hashtags || []);
    }

    const captionResult = await generateCaptions(data.topic);
    if (captionResult.error) {
      toast({ variant: 'destructive', title: 'Error', description: captionResult.error });
    } else {
      setCaptions(captionResult.captions || null);
    }

    setIsLoading(false);
  }
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(prev => ({ ...prev, [id]: true }));
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Hashtag & Caption Generator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Enter a topic or keyword to instantly generate trending hashtags and engaging captions for your social media.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Topic or Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 'AI technology', 'Summer vacation ideas'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(hashtags.length > 0 || captions) && (
        <Tabs defaultValue="hashtags" className="mt-8 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hashtags">Trending Hashtags</TabsTrigger>
            <TabsTrigger value="captions">Generated Captions</TabsTrigger>
          </TabsList>
          <TabsContent value="hashtags">
            <Card>
              <CardHeader>
                <CardTitle>Trending Hashtags</CardTitle>
                <CardDescription>Click on a hashtag to copy it.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer text-base"
                    onClick={() => handleCopy(tag, `tag-${index}`)}
                  >
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="captions">
            <Card>
              <CardHeader>
                <CardTitle>Generated Captions</CardTitle>
                <CardDescription>Captions tailored for each platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {captions?.instagramReelsCaption && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-lg font-semibold">Instagram Reels</h3>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(captions.instagramReelsCaption, 'insta')}>
                        {copyState['insta'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-2 rounded-md bg-muted p-4 text-muted-foreground">{captions.instagramReelsCaption}</p>
                  </div>
                )}
                <Separator />
                {captions?.tiktokCaption && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-lg font-semibold">TikTok</h3>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(captions.tiktokCaption, 'tiktok')}>
                        {copyState['tiktok'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-2 rounded-md bg-muted p-4 text-muted-foreground">{captions.tiktokCaption}</p>
                  </div>
                )}
                <Separator />
                {captions?.youtubeShortsDescription && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-lg font-semibold">YouTube Shorts</h3>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(captions.youtubeShortsDescription, 'youtube')}>
                        {copyState['youtube'] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-2 rounded-md bg-muted p-4 text-muted-foreground">{captions.youtubeShortsDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
