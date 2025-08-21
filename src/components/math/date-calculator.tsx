
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInDays, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DateCalculator() {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<number | null>(null);
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [daysToAdd, setDaysToAdd] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [resultDate, setResultDate] = useState<Date | null>(null);

  const calculateDuration = () => {
    if (fromDate && toDate) {
      setDuration(Math.abs(differenceInDays(fromDate, toDate)));
    }
  };
  
  const calculateDate = () => {
    const days = parseInt(daysToAdd);
    if(startDate && !isNaN(days)){
        if(operation === 'add') {
            setResultDate(addDays(startDate, days));
        } else {
            setResultDate(subDays(startDate, days));
        }
    }
  };

  return (
    <Tabs defaultValue="duration" className="mt-8 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="duration">Duration Between Dates</TabsTrigger>
        <TabsTrigger value="add-subtract">Add/Subtract Days</TabsTrigger>
      </TabsList>
      <TabsContent value="duration">
        <Card>
          <CardHeader>
            <CardTitle>Duration Calculator</CardTitle>
            <CardDescription>Calculate the number of days between two dates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !toDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button onClick={calculateDuration} className="w-full">Calculate Duration</Button>
          </CardContent>
          {duration !== null && (
            <CardFooter>
              <div className="w-full rounded-lg bg-muted p-4 text-center">
                <p className="text-lg">Duration:</p>
                <p className="text-3xl font-bold">{duration} days</p>
              </div>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="add-subtract">
        <Card>
           <CardHeader>
            <CardTitle>Add or Subtract Days</CardTitle>
            <CardDescription>Find a future or past date from a start date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Button variant={operation === 'add' ? 'default' : 'outline'} onClick={() => setOperation('add')} className="w-full">Add</Button>
                    <Button variant={operation === 'subtract' ? 'default' : 'outline'} onClick={() => setOperation('subtract')} className="w-full">Subtract</Button>
                </div>
                <div className="space-y-2">
                    <Label>Days</Label>
                    <Input type="number" placeholder="e.g. 30" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} />
                </div>
              </div>
             <Button onClick={calculateDate} className="w-full">Calculate Date</Button>
          </CardContent>
           {resultDate !== null && (
            <CardFooter>
              <div className="w-full rounded-lg bg-muted p-4 text-center">
                <p className="text-lg">Resulting Date:</p>
                <p className="text-3xl font-bold">{format(resultDate, 'PPP')}</p>
              </div>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
