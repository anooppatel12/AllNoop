
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ChatLobby() {
  const router = useRouter();
  const { toast } = useToast();
  const [newRoomId, setNewRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const handleCreateRoom = () => {
    const roomId = uuidv4();
    setNewRoomId(roomId);
  };

  const handleCopyToClipboard = () => {
    if (!newRoomId) return;
    const url = `${window.location.origin}/chat/${newRoomId}`;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (joinRoomId.trim()) {
      router.push(`/chat/${joinRoomId.trim()}`);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Create or Join a Room</CardTitle>
        <CardDescription>
          Create a new private chat room or enter an existing room ID to join.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Create a New Room</Label>
          <Button onClick={handleCreateRoom} className="w-full">
            Generate Secure Room Link
          </Button>
        </div>

        {newRoomId && (
          <div className="rounded-lg border bg-muted p-4 space-y-3">
            <Label>Your new room link:</Label>
            <div className="flex gap-2">
              <Input value={`${window.location.origin}/chat/${newRoomId}`} readOnly />
              <Button size="icon" onClick={handleCopyToClipboard}>
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={() => router.push(`/chat/${newRoomId}`)} className="w-full">
              Go to Room <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="join-room-id">Join an Existing Room</Label>
          <div className="flex gap-2">
            <Input
              id="join-room-id"
              placeholder="Enter Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
            />
            <Button onClick={handleJoinRoom} disabled={!joinRoomId.trim()}>
              Join Room
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
