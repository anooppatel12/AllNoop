
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SLEEP_CYCLE_MINUTES = 90;
const TIME_TO_FALL_ASLEEP_MINUTES = 14;

export function SleepCalculator() {
  const [activeTab, setActiveTab] = useState('wakeup');
  const [time, setTime] = useState('23:00');
  const [results, setResults] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateTimes = () => {
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const baseDate = new Date();
    baseDate.setHours(hours, minutes, 0, 0);

    const calculatedTimes: string[] = [];

    if (activeTab === 'wakeup') {
      setTitle(`If you go to bed now, you should wake up at:`);
      const fallAsleepTime = new Date(baseDate.getTime() + TIME_TO_FALL_ASLEEP_MINUTES * 60000);
      for (let i = 6; i >= 3; i--) { // 6 to 3 sleep cycles
        const wakeupTime = new Date(fallAsleepTime.getTime() + i * SLEEP_CYCLE_MINUTES * 60000);
        calculatedTimes.push(`${formatTime(wakeupTime)} (${i} cycles)`);
      }
    } else { // bedtime
      setTitle(`To wake up at ${formatTime(baseDate)}, you should go to bed at:`);
      for (let i = 6; i >= 3; i--) { // 6 to 3 sleep cycles
        const fallAsleepTime = new Date(baseDate.getTime() - i * SLEEP_CYCLE_MINUTES * 60000);
        const bedtime = new Date(fallAsleepTime.getTime() - TIME_TO_FALL_ASLEEP_MINUTES * 60000);
        calculatedTimes.push(`${formatTime(bedtime)} (${i} cycles)`);
      }
    }
    setResults(calculatedTimes.reverse());
  };
  
  const handleTabChange = (value: string) => {
      setActiveTab(value);
      setResults([]);
      setTitle('');
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="wakeup">I want to wake up at...</TabsTrigger>
        <TabsTrigger value="bedtime">I want to go to bed at...</TabsTrigger>
      </TabsList>
      <TabsContent value="wakeup">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Bedtime</CardTitle>
              <CardDescription>Select the time you want to wake up to find out the best times to fall asleep.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="wakeup-time">Wake-up Time</Label>
                    <Input id="wakeup-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <Button onClick={calculateTimes} className="w-full">Calculate Bedtimes</Button>
            </CardContent>
             {results.length > 0 && (
                <CardFooter className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {results.map((result, index) => (
                        <div key={index} className="rounded-lg bg-primary/10 p-3 text-center">
                            <p className="text-xl font-bold text-primary">{result.split(' ')[0]}</p>
                            <p className="text-sm text-muted-foreground">{result.split(' ').slice(1).join(' ')}</p>
                        </div>
                    ))}
                    </div>
                </CardFooter>
            )}
          </Card>
      </TabsContent>
      <TabsContent value="bedtime">
        <Card>
            <CardHeader>
              <CardTitle>Calculate Wake-up Time</CardTitle>
              <CardDescription>Select the time you want to go to bed to find out the best times to wake up.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="bedtime-time">Bedtime</Label>
                    <Input id="bedtime-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <Button onClick={calculateTimes} className="w-full">Calculate Wake-up Times</Button>
            </CardContent>
            {results.length > 0 && (
                <CardFooter className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {results.map((result, index) => (
                        <div key={index} className="rounded-lg bg-primary/10 p-3 text-center">
                            <p className="text-xl font-bold text-primary">{result.split(' ')[0]}</p>
                            <p className="text-sm text-muted-foreground">{result.split(' ').slice(1).join(' ')}</p>
                        </div>
                    ))}
                    </div>
                     <p className="mt-4 text-xs text-muted-foreground">
                        It's recommended to get 5-6 full sleep cycles. Calculations are based on an average of 14 minutes to fall asleep.
                    </p>
                </CardFooter>
            )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
