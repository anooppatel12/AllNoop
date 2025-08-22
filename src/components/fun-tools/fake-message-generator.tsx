
'use client';

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { RefreshCw, Battery, Wifi, Signal, Check, CheckCheck, Trash2, Plus, MessageSquare, Reply, Download } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '@/hooks/use-toast';

type Message = {
    id: number;
    sender: 'me' | 'them';
    content: string;
    status?: 'sent' | 'delivered' | 'read';
    time?: string;
};

export function FakeMessageGenerator() {
  const { toast } = useToast();
  const [mode, setMode] = useState<'sms' | 'email' | 'whatsapp'>('sms');

  // Refs for download
  const smsPreviewRef = useRef<HTMLDivElement>(null);
  const emailPreviewRef = useRef<HTMLDivElement>(null);
  const waPreviewRef = useRef<HTMLDivElement>(null);

  // SMS State
  const [smsOtherSender, setSmsOtherSender] = useState('Mom');
  const [smsMessages, setSmsMessages] = useState<Message[]>([
    { id: 1, sender: 'them', content: 'Did you remember to take the chicken out of the freezer?' },
    { id: 2, sender: 'me', content: 'Yes, I did!' },
  ]);

  // Email State
  const [emailFrom, setEmailFrom] = useState('boss@example.com');
  const [emailTo, setEmailTo] = useState('you@example.com');
  const [emailSubject, setEmailSubject] = useState('Urgent: Project Update');
  const [emailBody, setEmailBody] = useState('Hi team,\n\nPlease find the attached documents for the quarterly review. We need to have this finalized by EOD.\n\nThanks,\nYour Boss');
  
  // WhatsApp State
  const [waOtherSender, setWaOtherSender] = useState('Best Friend');
   const [waMessages, setWaMessages] = useState<Message[]>([
    { id: 1, sender: 'them', content: 'Hey, are we still on for tonight?', time: '10:45 PM', status: 'read' },
    { id: 2, sender: 'me', content: 'Absolutely! See you at 8.', time: '10:46 PM', status: 'read' },
  ]);

  const addSmsMessage = () => {
    const lastSender = smsMessages.length > 0 ? smsMessages[smsMessages.length - 1].sender : 'me';
    const newSender = lastSender === 'me' ? 'them' : 'me';
    setSmsMessages([...smsMessages, { id: Date.now(), sender: newSender, content: '' }]);
  };

  const updateSmsMessage = (index: number, field: keyof Message, value: string) => {
    const newMessages = [...smsMessages];
    (newMessages[index] as any)[field] = value;
    setSmsMessages(newMessages);
  };
  
  const removeSmsMessage = (index: number) => {
    setSmsMessages(smsMessages.filter((_, i) => i !== index));
  }

  const addWaMessage = () => {
    const lastSender = waMessages.length > 0 ? waMessages[waMessages.length - 1].sender : 'me';
    const newSender = lastSender === 'me' ? 'them' : 'me';
    setWaMessages([...waMessages, { id: Date.now(), sender: newSender, content: '', time: '10:47 PM', status: 'read' }]);
  };
  
   const updateWaMessage = (index: number, field: keyof Message, value: string) => {
    const newMessages = [...waMessages];
    (newMessages[index] as any)[field] = value;
    setWaMessages(newMessages);
  };
  
  const removeWaMessage = (index: number) => {
    setWaMessages(waMessages.filter((_, i) => i !== index));
  }
  
  const resetEmail = () => {
    setEmailFrom('boss@example.com');
    setEmailTo('you@example.com');
    setEmailSubject('Urgent: Project Update');
    setEmailBody('Hi team,\n\nPlease find the attached documents for the quarterly review. We need to have this finalized by EOD.\n\nThanks,\nYour Boss');
  }

  const handleDownload = useCallback(async () => {
    let elementToCapture: HTMLDivElement | null = null;
    let fileName = 'fake-message.png';

    if (mode === 'sms' && smsPreviewRef.current) {
      elementToCapture = smsPreviewRef.current;
      fileName = 'fake-sms.png';
    } else if (mode === 'email' && emailPreviewRef.current) {
      elementToCapture = emailPreviewRef.current;
      fileName = 'fake-email.png';
    } else if (mode === 'whatsapp' && waPreviewRef.current) {
      elementToCapture = waPreviewRef.current;
      fileName = 'fake-whatsapp-chat.png';
    }

    if (elementToCapture === null) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find the element to download.' });
      return;
    }

    try {
        const dataUrl = await toPng(elementToCapture, { 
            cacheBust: true, 
            pixelRatio: 2,
            fetchRequestInit: {
                mode: 'cors',
                credentials: 'omit'
            }
        });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error(err);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not generate the image.' });
      }
  }, [mode, toast]);


  const ReadReceipt = ({ status }: { status?: 'sent' | 'delivered' | 'read' }) => {
      if (status === 'read') return <CheckCheck className="h-4 w-4 text-blue-500"/>;
      if (status === 'delivered') return <CheckCheck className="h-4 w-4 text-gray-500"/>;
      return <Check className="h-4 w-4 text-gray-500"/>;
  }

  return (
    <Card className="mt-8">
       <Tabs value={mode} onValueChange={(v) => setMode(v as 'sms' | 'email' | 'whatsapp')} className="w-full">
         <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sms">Fake SMS</TabsTrigger>
                <TabsTrigger value="email">Fake Email</TabsTrigger>
                <TabsTrigger value="whatsapp">Fake WhatsApp</TabsTrigger>
            </TabsList>
          </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CONTROLS */}
            <div className="space-y-4">
                <TabsContent value="sms" className="m-0 space-y-4">
                    <CardTitle>SMS Controls</CardTitle>
                    <div className="space-y-2">
                        <Label htmlFor="sms-sender">Other Person's Name</Label>
                        <Input id="sms-sender" value={smsOtherSender} onChange={(e) => setSmsOtherSender(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Messages</Label>
                        {smsMessages.map((msg, index) => (
                             <div key={msg.id} className="flex items-start gap-2 rounded-lg border p-2">
                                <RadioGroup value={msg.sender} onValueChange={(v) => updateSmsMessage(index, 'sender', v)} className="mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="them" id={`sms-${msg.id}-them`}/><Label htmlFor={`sms-${msg.id}-them`} className="cursor-pointer"><Reply className="h-4 w-4"/></Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="me" id={`sms-${msg.id}-me`} /><Label htmlFor={`sms-${msg.id}-me`} className="cursor-pointer"><MessageSquare className="h-4 w-4"/></Label></div>
                                </RadioGroup>
                                <Textarea value={msg.content} onChange={(e) => updateSmsMessage(index, 'content', e.target.value)} rows={2} className="flex-1"/>
                                <Button variant="ghost" size="icon" onClick={() => removeSmsMessage(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                    <Button onClick={addSmsMessage} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4"/>Add Message</Button>
                </TabsContent>

                <TabsContent value="email" className="m-0 space-y-4">
                    <CardTitle>Email Generator</CardTitle>
                    <div className="space-y-2">
                        <Label htmlFor="email-from">From</Label>
                        <Input id="email-from" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-to">To</Label>
                        <Input id="email-to" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-body">Body</Label>
                        <Textarea id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} />
                    </div>
                    <Button onClick={resetEmail} variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Reset Email
                    </Button>
                </TabsContent>

                <TabsContent value="whatsapp" className="m-0 space-y-4">
                    <CardTitle>WhatsApp Controls</CardTitle>
                    <div className="space-y-2">
                        <Label htmlFor="wa-sender">Other Person's Name</Label>
                        <Input id="wa-sender" value={waOtherSender} onChange={(e) => setWaOtherSender(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Messages</Label>
                        {waMessages.map((msg, index) => (
                             <div key={msg.id} className="grid grid-cols-1 gap-2 rounded-lg border p-2">
                                <div className="flex items-start gap-2">
                                    <RadioGroup value={msg.sender} onValueChange={(v) => updateWaMessage(index, 'sender', v)} className="mt-2">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="them" id={`wa-${msg.id}-them`}/><Label htmlFor={`wa-${msg.id}-them`} className="cursor-pointer"><Reply className="h-4 w-4"/></Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="me" id={`wa-${msg.id}-me`} /><Label htmlFor={`wa-${msg.id}-me`} className="cursor-pointer"><MessageSquare className="h-4 w-4"/></Label></div>
                                    </RadioGroup>
                                    <Textarea value={msg.content} onChange={(e) => updateWaMessage(index, 'content', e.target.value)} rows={2} className="flex-1"/>
                                    <Button variant="ghost" size="icon" onClick={() => removeWaMessage(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Input placeholder="Time" value={msg.time} onChange={(e) => updateWaMessage(index, 'time', e.target.value)} className="text-xs h-8"/>
                                    <Select value={msg.status} onValueChange={(v) => updateWaMessage(index, 'status', v)}>
                                        <SelectTrigger className="text-xs h-8"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sent">Sent</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="read">Read</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                     <Button onClick={addWaMessage} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4"/>Add Message</Button>
                </TabsContent>
                <Button onClick={handleDownload} variant="default" className="w-full">
                    <Download className="mr-2 h-4 w-4"/>Download as Image
                </Button>
            </div>

            {/* PREVIEW */}
          <div className="rounded-xl border bg-muted p-4 flex items-center justify-center">
             <div ref={smsPreviewRef} className={cn("contents", mode !== 'sms' && "hidden")}>
                <div className="w-full max-w-[320px] rounded-2xl bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow-lg flex flex-col h-[550px]">
                    <div className="flex justify-between items-center text-xs px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-t-2xl">
                        <span>10:30 AM</span>
                        <div className="flex items-center gap-1">
                            <Signal size={14} />
                            <Wifi size={14} />
                            <Battery size={14} />
                        </div>
                    </div>
                    <header className="p-3 border-b border-gray-300 dark:border-gray-700 flex items-center">
                        <Avatar className="h-8 w-8 mr-2"><AvatarFallback>{smsOtherSender.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                        <h3 className="font-semibold">{smsOtherSender}</h3>
                    </header>
                    <main className="flex-1 p-3 overflow-y-auto space-y-3">
                        {smsMessages.map(msg => (
                            <div key={msg.id} className={cn("flex", msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                <div className={cn("rounded-xl p-2.5 text-sm max-w-[80%]", msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700')}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </main>
                </div>
             </div>
             <div ref={emailPreviewRef} className={cn("contents", mode !== 'email' && "hidden")}>
                <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 text-sm">
                    <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{emailFrom.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{emailFrom}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">to: {emailTo}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">10:32 AM</span>
                    </div>
                    <h2 className="font-bold text-lg mb-2">{emailSubject}</h2>
                    <div className="border-t pt-4 mt-4 whitespace-pre-wrap">
                        {emailBody}
                    </div>
                </div>
             </div>
             <div ref={waPreviewRef} className={cn("contents", mode !== 'whatsapp' && "hidden")}>
                <div className="w-full max-w-[320px] bg-stone-100 dark:bg-[#0b141a] shadow-lg flex flex-col h-[550px] border">
                    <header className="bg-[#005E54] dark:bg-[#202c33] text-white p-2.5 flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback>{waOtherSender.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-sm">{waOtherSender}</h3>
                    </header>
                    <main className="flex-1 p-3 overflow-y-auto space-y-1.5 flex flex-col bg-stone-100 dark:bg-[#0b141a]">
                        {waMessages.map(msg => (
                             <div key={msg.id} className={cn("flex w-full", msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                <div className={cn("rounded-lg p-1.5 px-2.5 max-w-[80%] relative shadow", msg.sender === 'me' ? 'bg-[#DCF8C6] dark:bg-[#005c4b]' : 'bg-white dark:bg-[#202c33]')}>
                                    <p className="text-sm text-black dark:text-white pr-4">{msg.content}</p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right -mt-1 -mr-1 flex items-center justify-end gap-1">
                                        <span>{msg.time}</span>
                                        {msg.sender === 'me' && <ReadReceipt status={msg.status}/>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </main>
                </div>
             </div>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
