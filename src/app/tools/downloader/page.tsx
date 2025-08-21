'use client';

import { DownloaderUI } from '@/features/downloader/DownloaderUI';

// This component checks the feature flag and renders the downloader UI if enabled.
// NEXT_PUBLIC_ is required for the variable to be exposed to the browser.
const isDownloaderEnabled = process.env.NEXT_PUBLIC_ENABLE_VIDEO_DOWNLOADER === 'true';

export default function DownloaderPage() {
  if (!isDownloaderEnabled) {
    // As per instructions, if the feature is not enabled, we render nothing,
    // effectively hiding the page from users.
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return null;
  }

  return <DownloaderUI />;
}
