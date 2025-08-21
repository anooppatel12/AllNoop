'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadButton } from './DownloadButton';
import { ProbeResponse } from './DownloaderUI';

interface ProbeResultProps {
  result: ProbeResponse;
  url: string;
}

export function ProbeResult({ result, url }: ProbeResultProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Download Options</CardTitle>
        <CardDescription>Select a format to begin your download.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-1/3">
             <Image
                src={result.thumbnail}
                alt={result.title}
                width={240}
                height={135}
                className="rounded-lg object-cover w-full"
                unoptimized // Necessary for external image URLs
                data-ai-hint="video thumbnail"
              />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold">{result.title}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {result.formats.map((format) => (
                <DownloadButton key={format.format_id} format={format} url={url} title={result.title} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
