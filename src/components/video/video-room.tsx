
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMultiWebRTC, type SmartNotes } from '@/hooks/use-multi-webrtc';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Check, MessageSquare, Bot, FileDown, Loader2, ScreenShare, Camera, FlipHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Input } from '../ui/input';

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
        let imgWidth = pdfWidth - 20; // with margin
        let imgHeight = imgWidth / ratio;
        let heightLeft = imgHeight;
        let position = 10;


        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while(heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('smart-notes.pdf');
    };


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <Bot className="mr-2 h-4 w-4"/>
                    <span className="hidden sm:inline">Smart Notes</span>
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
                            <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                                <Bot className="h-12 w-12 mb-4"/>
                                <p className="font-semibold">Notes will appear here.</p>
                                <p className="text-sm">Start chatting to generate the first summary.</p>
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
                    <div className="p-4 border-t bg-background">
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


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
                    <span className="hidden sm:inline">Chat</span>
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
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t flex gap-2 bg-background">
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
    isGeneratingNotes,
    toggleScreenShare,
    isScreenSharing,
    flipCamera,
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
  
  if (!localStream) {
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
  
  const numParticipants = allStreams.length;
  const gridLayout = 
      numParticipants <= 1 ? 'grid-cols-1 grid-rows-1' :
      numParticipants === 2 ? 'grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:grid-rows-1' :
      numParticipants <= 4 ? 'grid-cols-2 grid-rows-2' :
      numParticipants <= 6 ? 'grid-cols-3 grid-rows-2' :
      'grid-cols-3 grid-rows-3';

  return (
    <div className="flex h-screen flex-col bg-muted/40 text-foreground">
      <header className="p-4 flex justify-between items-center bg-background border-b shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
            <h1 className="text-xl font-bold truncate">Video Room</h1>
            <Badge variant="secondary">{allStreams.length} participant(s)</Badge>
        </div>
        <Button onClick={handleCopyLink} variant="outline" size="sm">
            {hasCopied ? <Check className="mr-2 h-4 w-4 text-green-500"/> : <Copy className="mr-2 h-4 w-4"/>}
            <span className="hidden sm:inline">Copy Link</span>
        </Button>
      </header>
      
      <main className={cn("flex-1 p-2 sm:p-4 grid gap-2 sm:gap-4", gridLayout)}>
        {allStreams.map(({ id, stream }, index) => (
             <div key={id} className="relative aspect-video overflow-hidden rounded-lg border shadow-md">
                <VideoPlayer stream={stream} isMuted={id === 'local'} />
                <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {id === 'local' ? 'You' : `Peer ${index}`}
                </div>
            </div>
        ))}
      </main>

      <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-background/80 border-t backdrop-blur-sm">
        <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-start">
                <ChatPanel sendMessage={sendMessage} messages={messages} />
            </div>
            <div className="flex justify-center gap-2 sm:gap-4">
                <Button onClick={toggleMic} variant={isMicOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full h-10 w-10 sm:h-12 sm:w-12">
                    {isMicOn ? <Mic /> : <MicOff />}
                </Button>
                <Button onClick={toggleCamera} variant={isCameraOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full h-10 w-10 sm:h-12 sm:w-12" disabled={isScreenSharing}>
                    {isCameraOn ? <Video /> : <VideoOff />}
                </Button>
                 <Button onClick={toggleScreenShare} variant={isScreenSharing ? 'default' : 'secondary'} size="icon" className="rounded-full h-10 w-10 sm:h-12 sm:w-12">
                    <ScreenShare />
                </Button>
                 <Button onClick={flipCamera} variant="secondary" size="icon" className="rounded-full h-10 w-10 sm:h-12 sm:w-12" disabled={isScreenSharing}>
                    <FlipHorizontal />
                </Button>
                <Button onClick={handleLeave} variant="destructive" size="lg" className="rounded-full h-12 w-12 sm:h-14 sm:w-14">
                    <PhoneOff />
                </Button>
            </div>
            <div className="flex-1 flex justify-end">
                 <SmartNotesPanel notes={smartNotes} isGenerating={isGeneratingNotes} />
            </div>
        </div>
      </footer>
    </div>
  );
}
