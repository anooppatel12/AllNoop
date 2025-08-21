
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const itagStr = searchParams.get('itag');
  const title = searchParams.get('title');
  const container = searchParams.get('container');

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid or missing YouTube URL' }, { status: 400 });
  }

  try {
    if (itagStr) {
      // Stream the video for download
      const itag = parseInt(itagStr);
      const videoStream = ytdl(url, { itag });
      
      const safeTitle = title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'video';

      const headers = new Headers();
      headers.set('Content-Disposition', `attachment; filename="${safeTitle}.${container}"`);
      headers.set('Content-Type', `video/${container}`);

      // Here we have to cast because the expected type is ReadableStream<any> | null
      // but ytdl-core returns a stream that is compatible.
      return new NextResponse(videoStream as any, { headers });

    } else {
      // Fetch video info
      const info = await ytdl.getInfo(url);
      
      const formats = info.formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          qualityLabel: format.qualityLabel,
          itag: format.itag,
          container: format.container,
          hasVideo: format.hasVideo,
          hasAudio: format.hasAudio,
          contentLength: format.contentLength,
        }))
        // Add audio only format
        .concat(
             ...ytdl.filterFormats(info.formats, 'audioonly').map(format => ({
                qualityLabel: 'MP3',
                itag: format.itag,
                container: 'mp3',
                hasVideo: format.hasVideo,
                hasAudio: format.hasAudio,
                contentLength: format.contentLength,
             }))
        )
        .sort((a,b) => parseInt(b.qualityLabel) - parseInt(a.qualityLabel));


      const response = {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
        formats: formats,
      };

      return NextResponse.json(response);
    }
  } catch (error: any) {
    console.error('Error with ytdl:', error);
    return NextResponse.json({ error: error.message || 'Failed to process YouTube video' }, { status: 500 });
  }
}
