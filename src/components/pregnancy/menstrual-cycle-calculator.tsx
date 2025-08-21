
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

export function MenstrualCycleCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>();
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [nextPeriod, setNextPeriod] = useState<{ start: Date; end: Date } | null>(null);

  const calculateNextPeriod = () => {
    if (lastPeriodDate && cycleLength && periodLength) {
      const cycle = parseInt(cycleLength);
      const period = parseInt(periodLength);
      const nextPeriodStart = addDays(lastPeriodDate, cycle);
      const nextPeriodEnd = addDays(nextPeriodStart, period -1);
      
      setNextPeriod({ start: nextPeriodStart, end: nextPeriodEnd });
    }
  };

  const resetCalculator = () => {
    setLastPeriodDate(undefined);
    setCycleLength('28');
    setPeriodLength('5');
    setNextPeriod(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Next Period Prediction</CardTitle>
        <CardDescription>Enter the details of your last period to predict your next one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label>First Day of Last Period</Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !lastPeriodDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriodDate ? format(lastPeriodDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={lastPeriodDate} onSelect={setLastPeriodDate} initialFocus disabled={(date) => date > new Date()} /></PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
                <Label htmlFor="cycle-length-menstrual">Average Cycle Length (days)</Label>
                <Input id="cycle-length-menstrual" type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g. 28" />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="period-length">Average Period Length (days)</Label>
                <Input id="period-length" type="number" value={periodLength} onChange={(e) => setPeriodLength(e.target.value)} placeholder="e.g. 5" />
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateNextPeriod} className="w-full">Calculate Next Period</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {nextPeriod && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your next period is estimated to be from:</p>
            <p className="text-2xl font-bold text-primary">
              {format(nextPeriod.start, 'MMM d')} to {format(nextPeriod.end, 'MMM d, yyyy')}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
