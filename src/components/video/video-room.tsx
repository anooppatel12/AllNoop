
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMultiWebRTC, type SmartNotes } from '@/hooks/use-multi-webrtc';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Check, MessageSquare, Bot, FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const VideoPlayer = ({ stream, isMuted }: { stream: MediaStream, isMuted: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-full object-cover rounded-lg bg-black" />;
}

const SmartNotesPanel = ({ notes, isGenerating }: { notes: SmartNotes | null, isGenerating: boolean }) => {
    const notesRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        const panel = notesRef.current;
        if (!panel) return;

        const canvas = await html2canvas(panel, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with margin
        const imgHeight = imgWidth / ratio;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('smart-notes.pdf');
    };


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <Bot className="mr-2 h-4 w-4"/>
                    Smart Notes
                    {isGenerating && <Loader2 className="ml-2 h-4 w-4 animate-spin"/>}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[540px] p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>AI-Generated Smart Notes</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6" ref={notesRef}>
                        {!notes ? (
                            <div className="text-center text-muted-foreground">
                                <p>Notes will appear here as the meeting progresses.</p>
                                <p>Start chatting to generate the first summary.</p>
                            </div>
                        ) : (
                            <Accordion type="multiple" defaultValue={['summary', 'keyPoints', 'actionItems']} className="w-full">
                                <AccordionItem value="summary">
                                    <AccordionTrigger className="text-lg font-semibold">Summary</AccordionTrigger>
                                    <AccordionContent className="prose dark:prose-invert">
                                        {notes.summary}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="keyPoints">
                                    <AccordionTrigger className="text-lg font-semibold">Key Points</AccordionTrigger>
                                    <AccordionContent className="prose dark:prose-invert">
                                        <ul className="list-disc pl-5">
                                            {notes.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="actionItems">
                                    <AccordionTrigger className="text-lg font-semibold">Action Items</AccordionTrigger>
                                    <AccordionContent className="prose dark:prose-invert">
                                       {notes.actionItems.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {notes.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                       ) : (
                                        <p>No action items were identified.</p>
                                       )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </div>
                    <div className="p-6 border-t">
                        <Button onClick={handleDownload} disabled={!notes} className="w-full">
                            <FileDown className="mr-2 h-4 w-4"/>
                            Download as PDF
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

const ChatPanel = ({ sendMessage, messages }: { sendMessage: (msg: string) => void, messages: {sender: string, text: string}[] }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if(message.trim()){
            sendMessage(message);
            setMessage('');
        }
    }

    return (
         <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4"/>
                    Chat
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[440px] p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>Meeting Chat</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className="flex flex-col items-start gap-1">
                                <p className="text-xs text-muted-foreground">{msg.sender}</p>
                                <p className="rounded-lg bg-muted px-3 py-2">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t flex gap-2">
                        <Input 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."/>
                        <Button onClick={handleSend}>Send</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}


export function VideoRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    localStream, 
    remoteStreams, 
    toggleMic, 
    toggleCamera, 
    leaveRoom, 
    isMicOn, 
    isCameraOn,
    sendMessage,
    messages,
    smartNotes,
    isGeneratingNotes
  } = useMultiWebRTC(roomId);
  
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
        <div className="flex justify-between items-center">
            <div>
                <ChatPanel sendMessage={sendMessage} messages={messages} />
            </div>
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
            <div>
                 <SmartNotesPanel notes={smartNotes} isGenerating={isGeneratingNotes} />
            </div>
        </div>
      </footer>
    </div>
  );
}
