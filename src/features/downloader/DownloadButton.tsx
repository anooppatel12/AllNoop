'use client';

import React, { useState } from 'react';
import ky from 'ky';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { Format } from './DownloaderUI';

interface DownloadButtonProps {
  format: Format;
  url: string;
}

export function DownloadButton({ format, url }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.loading(`Preparing download: ${format.resolution || format.note}...`, { id: format.format_id });

    try {
      const response = await ky.post('/api/downloader/download', {
        json: { url, format_id: format.format_id },
        timeout: false, // Important for long downloads
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = (document.title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      a.href = downloadUrl;
      a.download = `${safeTitle}.${format.ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
      
      toast.success('Download started!', { id: format.format_id });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try another format.', { id: format.format_id });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      <div className="text-left">
        <p>{format.resolution || format.ext}</p>
        <p className="text-xs text-muted-foreground">
          {format.filesize ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB` : format.ext}
        </p>
      </div>
    </Button>
  );
}
