'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ky from 'ky';

import { UrlInput, urlInputSchema } from './UrlInput';
import { ProbeResult } from './ProbeResult';
import { Toasts } from './Toasts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export interface Format {
  format_id: string;
  ext: string;
  resolution: string;
  filesize?: number;
  note?: string;
}

export interface ProbeResponse {
  title: string;
  thumbnail: string;
  formats: Format[];
}

export default function DownloaderPage() {
  const [probeResult, setProbeResult] = useState<ProbeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const methods = useForm<z.infer<typeof urlInputSchema>>({
    resolver: zodResolver(urlInputSchema),
    defaultValues: {
      url: '',
      consent: false,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof urlInputSchema>> = async (data) => {
    setIsLoading(true);
    setError(null);
    setProbeResult(null);
    setCurrentUrl(data.url);

    try {
      const response: ProbeResponse = await ky.post('/api/downloader/probe', { json: { url: data.url } }).json();
      setProbeResult(response);
    } catch (err: any) {
      const errorData = await err.response?.json();
      setError(errorData?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toasts />
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            SmartToolHub Video Downloader
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Paste a video URL → Get available formats → Download.
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Enter Video URL</CardTitle>
            <CardDescription>Paste the link to the video you want to download.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <UrlInput />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Formats
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {isLoading && !probeResult && (
            <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Probing URL...</p>
            </div>
        )}

        {probeResult && (
          <ProbeResult result={probeResult} url={currentUrl} />
        )}
      </div>
    </>
  );
}
