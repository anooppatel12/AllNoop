// IMPORTANT: Add 'yt-dlp-exec' to dependencies
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import { PassThrough } from 'stream';

const DOMAINS_ALLOWLIST = (process.env.DOMAINS_ALLOWLIST || 'youtube.com,youtu.be').split(',');

function isAllowedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return DOMAINS_ALLOWLIST.some(domain => hostname.endsWith(domain));
  } catch (error) {
    return false;
  }
}

async function handler(req: NextRequest, { params }: { params: { route: string[] } }) {
  const route = params.route[0];
  const { url, format_id } = await req.json();

  if (!url || !isAllowedDomain(url)) {
    return NextResponse.json({ error: 'Invalid or disallowed URL.' }, { status: 400 });
  }

  // Currently, only YouTube is supported by the backend library.
  const isYouTube = new URL(url).hostname.includes('youtube') || new URL(url).hostname.includes('youtu.be');
  if (!isYouTube) {
      return NextResponse.json({ error: 'Sorry, only YouTube downloads are supported at this time.' }, { status: 400 });
  }

  if (route === 'probe') {
    try {
      const info = await ytdl.getInfo(url);
      const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
      
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly').map(f => ({
          format_id: f.itag.toString(),
          ext: 'mp3',
          resolution: 'Audio Only',
          filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
          note: f.audioBitrate ? `${f.audioBitrate}kbps` : 'MP3'
      }));

      const videoFormats = formats.map(f => ({
        format_id: f.itag.toString(),
        ext: f.container,
        resolution: f.qualityLabel,
        filesize: f.contentLength ? parseInt(f.contentLength) : undefined,
        note: f.qualityLabel,
      })).sort((a,b) => parseInt(b.resolution) - parseInt(a.resolution));

      const response = {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
        formats: [...audioFormats, ...videoFormats],
      };

      return NextResponse.json(response);
    } catch (error: any) {
      console.error('[/api/downloader/probe] Error:', error);
      return NextResponse.json({ error: 'Failed to probe video info. The video may be private or unavailable.' }, { status: 500 });
    }
  }

  if (route === 'download') {
    try {
        const readable = ytdl(url, { quality: format_id });
        const stream = new PassThrough();
        readable.pipe(stream);

        const safeTitle = (await ytdl.getInfo(url)).videoDetails.title.replace(/[^a-z0-9]/gi, '_');
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: format_id });

        return new NextResponse(stream as any, {
            headers: {
                'Content-Disposition': `attachment; filename="${safeTitle}.${format.container}"`,
                'Content-Type': `video/${format.container}`,
            },
        });
    } catch (error: any) {
      console.error('[/api/downloader/download] Error:', error);
      return NextResponse.json({ error: 'Failed to start download stream.' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid route.' }, { status: 404 });
}

export const POST = handler;
