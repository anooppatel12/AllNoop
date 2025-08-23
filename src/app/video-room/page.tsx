
import { VideoLobby } from '@/components/video/video-lobby';

export default function VideoLobbyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Multi-User Video Room
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Create a private video room and share the link with others to start a secure, peer-to-peer video conference. No sign-up required.
        </p>
      </div>

      <VideoLobby />
    </div>
  );
}
