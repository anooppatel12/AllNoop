'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

const isDownloaderEnabled = process.env.NEXT_PUBLIC_ENABLE_VIDEO_DOWNLOADER === 'true';

/**
 * Renders a link to the Downloader tool page, but only if the feature is enabled
 * via environment variables. This component can be safely placed anywhere in the
 * application layout (e.g., Navbar, Footer).
 */
export function DownloaderLink() {
  if (!isDownloaderEnabled) {
    return null;
  }

  return (
    <Link href="/tools/downloader" passHref>
      <Button variant="ghost">
        <Video className="mr-2 h-4 w-4" />
        Video Downloader
      </Button>
    </Link>
  );
}
