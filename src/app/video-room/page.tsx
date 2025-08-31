
import { VideoLobby } from '@/components/video/video-lobby';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Bot } from 'lucide-react';

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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features for a Smarter Meeting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Experience a video conferencing tool built for simplicity, privacy, and productivity. Our video rooms use peer-to-peer WebRTC technology to ensure your calls are direct and secure.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <div className="rounded-lg border p-4">
                <Shield className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Secure & Private</h3>
                <p className="text-sm">Direct, encrypted connections between participants. Your video and audio streams never pass through our servers.</p>
             </div>
             <div className="rounded-lg border p-4">
                <Users className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Multi-User & Screen Sharing</h3>
                <p className="text-sm">Host meetings with multiple participants and share your screen for presentations or demonstrations.</p>
             </div>
             <div className="rounded-lg border p-4">
                <Bot className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">AI Smart Notes</h3>
                <p className="text-sm">Get an AI-generated summary, key points, and action items from your meeting chat, helping you stay organized.</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
