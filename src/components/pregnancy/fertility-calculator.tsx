
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type CycleInfo = {
  date: Date;
  length: number;
};

export function FertilityCalculator() {
  const [cycles, setCycles] = useState<CycleInfo[]>([{ date: new Date(), length: 28 }]);
  const [fertileWindow, setFertileWindow] = useState<{ start: Date; end: Date } | null>(null);
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null);

  const handleDateChange = (index: number, date: Date | undefined) => {
    if(date){
        const newCycles = [...cycles];
        newCycles[index].date = date;
        setCycles(newCycles);
    }
  };

  const handleLengthChange = (index: number, length: string) => {
    const newCycles = [...cycles];
    newCycles[index].length = parseInt(length) || 0;
    setCycles(newCycles);
  };
  
  const addCycle = () => {
      setCycles([...cycles, {date: new Date(), length: 28}]);
  }
  
  const removeCycle = (index: number) => {
      if(cycles.length > 1) {
        setCycles(cycles.filter((_, i) => i !== index));
      }
  }

  const calculateFertility = () => {
    if (cycles.length === 0) return;
    
    // Sort by date to get the most recent cycle first
    const sortedCycles = [...cycles].sort((a,b) => b.date.getTime() - a.date.getTime());
    const lastCycle = sortedCycles[0];
    
    const totalLength = sortedCycles.reduce((acc, c) => acc + c.length, 0);
    const avgCycleLength = totalLength / sortedCycles.length;

    const nextPeriodDate = addDays(lastCycle.date, avgCycleLength);
    const ovulationDate = subDays(nextPeriodDate, 14);
    
    const fertileStart = subDays(ovulationDate, 5);
    const fertileEnd = addDays(ovulationDate, 1);
    
    setFertileWindow({ start: fertileStart, end: fertileEnd });
    setNextPeriod(nextPeriodDate);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Advanced Fertility Calculator</CardTitle>
        <CardDescription>Enter the start date and length of your recent menstrual cycles for a more accurate prediction. The more cycles you enter, the better the prediction.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cycles.map((cycle, index) => (
          <div key={index} className="grid grid-cols-1 items-center gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_auto_auto]">
             <div className="space-y-2">
                <Label>First Day of Period</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !cycle.date && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {cycle.date ? format(cycle.date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={cycle.date} onSelect={(d) => handleDateChange(index, d)} initialFocus /></PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
                <Label htmlFor={`cycle-length-${index}`}>Cycle Length (days)</Label>
                <Input id={`cycle-length-${index}`} type="number" value={cycle.length} onChange={(e) => handleLengthChange(index, e.target.value)} placeholder="e.g. 28" />
            </div>
             <Button variant="ghost" size="icon" onClick={() => removeCycle(index)} disabled={cycles.length <= 1}>
                <span className="sr-only">Remove Cycle</span>
                &times;
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addCycle}>Add Another Cycle</Button>
         <div className="flex gap-4 pt-4">
          <Button onClick={calculateFertility} className="w-full">Calculate Fertility</Button>
        </div>
      </CardContent>
      {(fertileWindow && nextPeriod) && (
        <CardFooter>
            <div className="w-full rounded-lg bg-muted p-4 text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-lg font-semibold">Estimated Fertile Window:</p>
                        <p className="text-2xl font-bold text-primary">
                            {format(fertileWindow.start, 'MMM d')} - {format(fertileWindow.end, 'MMM d, yyyy')}
                        </p>
                    </div>
                     <div>
                        <p className="text-lg font-semibold">Estimated Next Period:</p>
                        <p className="text-2xl font-bold">
                            {format(nextPeriod, 'MMMM d, yyyy')}
                        </p>
                    </div>
                </div>
                 <Alert className="mt-4 text-left">
                    <AlertTitle>For Informational Purposes Only</AlertTitle>
                    <AlertDescription>
                        This calculator provides an estimate and should not be used for medical purposes or as a form of birth control. Consult a healthcare professional for personalized advice.
                    </AlertDescription>
                </Alert>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
