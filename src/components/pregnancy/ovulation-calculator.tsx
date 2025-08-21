
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export function OvulationCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>();
  const [cycleLength, setCycleLength] = useState('28');
  const [fertileWindow, setFertileWindow] = useState<{ start: Date; end: Date; ovulation: Date } | null>(null);

  const calculateOvulation = () => {
    if (lastPeriodDate && cycleLength) {
      const length = parseInt(cycleLength);
      const ovulationDate = addDays(lastPeriodDate, length - 14);
      const fertileStart = subDays(ovulationDate, 5);
      const fertileEnd = addDays(ovulationDate, 1);
      
      setFertileWindow({ start: fertileStart, end: fertileEnd, ovulation: ovulationDate });
    }
  };

  const resetCalculator = () => {
    setLastPeriodDate(undefined);
    setCycleLength('28');
    setFertileWindow(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Fertility Window Calculation</CardTitle>
        <CardDescription>Enter the first day of your last period and your average cycle length.</CardDescription>
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
            <Label htmlFor="cycle-length-ovulation">Average Cycle Length (days)</Label>
            <Input id="cycle-length-ovulation" type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g. 28" />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateOvulation} className="w-full">Calculate Fertile Window</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {fertileWindow && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your next estimated fertile window is:</p>
            <p className="text-2xl font-bold text-primary">
              {format(fertileWindow.start, 'MMM d')} - {format(fertileWindow.end, 'MMM d, yyyy')}
            </p>
            <p className="mt-2">Estimated Ovulation Date: <span className="font-semibold">{format(fertileWindow.ovulation, 'MMMM d, yyyy')}</span></p>
             <p className="mt-4 text-xs text-muted-foreground">
              Disclaimer: This is an estimate. For higher accuracy, track your cycles over several months.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
