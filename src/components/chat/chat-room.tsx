'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useWebRTC } from '@/hooks/use-webrtc';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Copy, Check } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'peer';
};

export function ChatRoom({ roomId }: { roomId: string }) {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: message, sender: 'peer' }]);
  }, []);

  const { connectionState, sendMessage } = useWebRTC(roomId, handleNewMessage);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: inputValue, sender: 'me' }]);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
        setTimeout(() => {
             if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector('div');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }
        }, 100);
    }
  }, [messages]);
  
  const [hasCopied, setHasCopied] = useState(false);
  const handleCopyToClipboard = () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (connectionState) {
        case 'new': return <Badge variant="secondary">Waiting for peer...</Badge>;
        case 'connecting': return <Badge variant="secondary">Connecting...</Badge>;
        case 'connected': return <Badge variant="default" className="bg-green-500">Connected</Badge>;
        case 'disconnected': return <Badge variant="destructive">Disconnected</Badge>;
        case 'failed': return <Badge variant="destructive">Failed</Badge>;
        default: return <Badge variant="outline">Unknown</Badge>;
    }
  }

  const isConnected = connectionState === 'connected';

  return (
    <div className="flex h-full flex-col p-4">
      <Card className="flex flex-1 flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
             <CardTitle className="flex items-center gap-2">
                Secure P2P Chat 
                {getStatusBadge()}
             </CardTitle>
             <div className="flex items-center gap-2">
                 <p className="text-sm text-muted-foreground truncate">Room: {roomId}</p>
                 <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCopyToClipboard}>
                    {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
               {messages.length === 0 && (
                <div className="text-center text-muted-foreground">
                    {isConnected 
                        ? 'Messages are end-to-end encrypted. Start chatting!'
                        : 'Waiting for another person to join the room.'}
                </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
          <div className="flex w-full items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isConnected ? "Type your message..." : "Waiting for connection..."}
              disabled={!isConnected}
            />
            <Button onClick={handleSend} disabled={!isConnected}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
