
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { RefreshCw, Battery, Wifi, Signal, Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function FakeMessageGenerator() {
  const [mode, setMode] = useState<'sms' | 'email' | 'whatsapp'>('sms');

  // SMS State
  const [smsSender, setSmsSender] = useState('Mom');
  const [smsMessage, setSmsMessage] = useState('Did you remember to take the chicken out of the freezer?');
  
  // Email State
  const [emailFrom, setEmailFrom] = useState('boss@example.com');
  const [emailTo, setEmailTo] = useState('you@example.com');
  const [emailSubject, setEmailSubject] = useState('Urgent: Project Update');
  const [emailBody, setEmailBody] = useState('Hi team,\n\nPlease find the attached documents for the quarterly review. We need to have this finalized by EOD.\n\nThanks,\nYour Boss');
  
  // WhatsApp State
  const [waSender, setWaSender] = useState('Best Friend');
  const [waMessage, setWaMessage] = useState('Hey, are we still on for tonight?');
  const [waTime, setWaTime] = useState('10:45 PM');
  const [waStatus, setWaStatus] = useState<'sent' | 'delivered' | 'read'>('read');
  
  const resetSms = () => {
    setSmsSender('Mom');
    setSmsMessage('Did you remember to take the chicken out of the freezer?');
  }
  
  const resetEmail = () => {
    setEmailFrom('boss@example.com');
    setEmailTo('you@example.com');
    setEmailSubject('Urgent: Project Update');
    setEmailBody('Hi team,\n\nPlease find the attached documents for the quarterly review. We need to have this finalized by EOD.\n\nThanks,\nYour Boss');
  }
  
  const resetWhatsApp = () => {
    setWaSender('Best Friend');
    setWaMessage('Hey, are we still on for tonight?');
    setWaTime('10:45 PM');
    setWaStatus('read');
  }

  const ReadReceipt = () => {
      if (waStatus === 'read') {
          return <CheckCheck className="h-4 w-4 text-blue-500"/>;
      }
      if (waStatus === 'delivered') {
          return <CheckCheck className="h-4 w-4 text-gray-500"/>;
      }
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
            <TabsContent value="sms" className="m-0 space-y-4">
                <CardTitle>SMS Generator</CardTitle>
                <div className="space-y-2">
                    <Label htmlFor="sms-sender">Sender Name</Label>
                    <Input id="sms-sender" value={smsSender} onChange={(e) => setSmsSender(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sms-message">Message</Label>
                    <Textarea id="sms-message" value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} rows={5} />
                </div>
                 <Button onClick={resetSms} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Reset SMS
                </Button>
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
                 <CardTitle>WhatsApp Generator</CardTitle>
                 <div className="space-y-2">
                    <Label htmlFor="wa-sender">Sender Name</Label>
                    <Input id="wa-sender" value={waSender} onChange={(e) => setWaSender(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="wa-message">Message</Label>
                    <Textarea id="wa-message" value={waMessage} onChange={(e) => setWaMessage(e.target.value)} rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="wa-time">Time</Label>
                        <Input id="wa-time" value={waTime} onChange={(e) => setWaTime(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Read Status</Label>
                        <Select value={waStatus} onValueChange={(v) => setWaStatus(v as 'sent' | 'delivered' | 'read')}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <Button onClick={resetWhatsApp} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Reset WhatsApp
                </Button>
            </TabsContent>

          <div className="rounded-xl border bg-muted p-4 flex items-center justify-center">
             {mode === 'sms' && (
                <div className="w-full max-w-[300px] rounded-2xl bg-gray-900 text-white shadow-lg p-2">
                    <div className="flex justify-between items-center text-xs px-2 mb-2">
                        <span>10:30 AM</span>
                        <div className="flex items-center gap-1">
                            <Signal size={14} />
                            <Wifi size={14} />
                            <Battery size={14} />
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center mb-4">
                             <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{smsSender.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold">{smsSender}</h3>
                        </div>
                        <div className="bg-blue-600 rounded-xl p-3 text-sm max-w-max">
                           {smsMessage}
                        </div>
                    </div>
                </div>
             )}
             {mode === 'email' && (
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
             )}
             {mode === 'whatsapp' && (
                <div className="w-full max-w-[320px] bg-[#E5DDD5] dark:bg-[#0D1418] shadow-lg flex flex-col h-[550px]">
                    <header className="bg-[#005E54] dark:bg-[#2A2F32] text-white p-2.5 flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback>{waSender.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-sm">{waSender}</h3>
                    </header>
                    <main className="flex-1 p-3 overflow-y-auto space-y-2">
                         <div className="flex justify-end">
                            <div className="bg-[#DCF8C6] dark:bg-[#056162] text-black dark:text-white rounded-lg p-2 max-w-[80%] relative">
                                <p className="text-sm">{waMessage}</p>
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1 flex items-center justify-end gap-1">
                                    <span>{waTime}</span>
                                    <ReadReceipt/>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
             )}
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
