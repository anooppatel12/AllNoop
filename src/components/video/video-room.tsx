
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMultiWebRTC } from '@/hooks/use-multi-webrtc';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const VideoPlayer = ({ stream, isMuted }: { stream: MediaStream, isMuted: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-full object-cover rounded-lg bg-black" />;
}

export function VideoRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { localStream, remoteStreams, toggleMic, toggleCamera, leaveRoom, isMicOn, isCameraOn } = useMultiWebRTC(roomId);
  const [hasCopied, setHasCopied] = useState(false);

  const allStreams = localStream ? [{ id: 'local', stream: localStream }, ...remoteStreams] : remoteStreams;

  const handleLeave = () => {
    leaveRoom();
    router.push('/video-room');
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    toast({ title: "Room link copied to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  if (!localStream && remoteStreams.length === 0) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
             <Alert className="max-w-md">
                <AlertTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Connecting to Video Room
                </AlertTitle>
                <AlertDescription>
                    Please allow camera and microphone access to join the room. If you've already granted permission, we're just waiting to establish a connection.
                </AlertDescription>
             </Alert>
        </div>
      )
  }

  return (
    <div className="flex h-screen flex-col bg-muted/40 text-foreground">
      <header className="p-4 flex justify-between items-center bg-background border-b">
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Video Room</h1>
            <Badge variant="secondary">{allStreams.length} participant(s)</Badge>
        </div>
        <Button onClick={handleCopyLink} variant="outline" size="sm">
            {hasCopied ? <Check className="mr-2 h-4 w-4 text-green-500"/> : <Copy className="mr-2 h-4 w-4"/>}
            Copy Link
        </Button>
      </header>
      
      <main className="flex-1 p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}>
        {localStream && (
             <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-primary shadow-lg">
                <VideoPlayer stream={localStream} isMuted={true} />
                <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">You</div>
            </div>
        )}
        {remoteStreams.map(({ id, stream }) => (
            <div key={id} className="relative aspect-video overflow-hidden rounded-lg border shadow-md">
                <VideoPlayer stream={stream} isMuted={false} />
            </div>
        ))}
      </main>

      <footer className="p-4 bg-background border-t">
        <div className="flex justify-center gap-4">
          <Button onClick={toggleMic} variant={isMicOn ? 'secondary' : 'destructive'} size="lg" className="rounded-full h-14 w-14">
            {isMicOn ? <Mic /> : <MicOff />}
          </Button>
          <Button onClick={toggleCamera} variant={isCameraOn ? 'secondary' : 'destructive'} size="lg" className="rounded-full h-14 w-14">
            {isCameraOn ? <Video /> : <VideoOff />}
          </Button>
          <Button onClick={handleLeave} variant="destructive" size="lg" className="rounded-full h-14 w-14">
            <PhoneOff />
          </Button>
        </div>
      </footer>
    </div>
  );
}
