
import { ChatLobby } from '@/components/chat/chat-lobby';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Zap } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Secure Peer-to-Peer Chat
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Create a private chat room and share the link with a friend to start a secure, end-to-end encrypted conversation directly in your browser.
        </p>
      </div>

      <ChatLobby />

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works: Your Privacy First</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Our P2P Chat tool is built with privacy and security at its core. Unlike traditional messaging apps, your conversations do not pass through a central server where they can be stored or read. Instead, we use WebRTC technology to create a direct, encrypted connection between your browser and your friend's browser.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <div className="rounded-lg border p-4">
                <Lock className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Private & Anonymous</h3>
                <p className="text-sm">No sign-up or personal information is required. Create a room, share the link, and start chatting.</p>
             </div>
             <div className="rounded-lg border p-4">
                <Shield className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">End-to-End Encrypted</h3>
                <p className="text-sm">All messages are encrypted from end-to-end, meaning only you and the recipient can read them.</p>
             </div>
             <div className="rounded-lg border p-4">
                <Zap className="mb-2 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Peer-to-Peer Connection</h3>
                <p className="text-sm">Your messages travel directly between devices, bypassing our servers entirely for maximum privacy.</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
