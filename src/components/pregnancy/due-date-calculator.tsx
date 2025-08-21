
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '../ui/input';

export function PregnancyDueDateCalculator() {
  const [calculationMethod, setCalculationMethod] = useState<'lmp' | 'conception'>('lmp');
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState<Date | undefined>();
  const [conceptionDate, setConceptionDate] = useState<Date | undefined>();
  const [cycleLength, setCycleLength] = useState('28');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const calculateDueDate = () => {
    let estimatedDueDate: Date | null = null;
    if (calculationMethod === 'lmp' && lastMenstrualPeriod) {
      const adjustment = parseInt(cycleLength) - 28;
      estimatedDueDate = addDays(lastMenstrualPeriod, 280 + adjustment);
    } else if (calculationMethod === 'conception' && conceptionDate) {
      estimatedDueDate = addDays(conceptionDate, 266);
    }
    setDueDate(estimatedDueDate);
  };

  const resetCalculator = () => {
    setLastMenstrualPeriod(undefined);
    setConceptionDate(undefined);
    setCycleLength('28');
    setDueDate(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Due Date Calculation</CardTitle>
        <CardDescription>Select your calculation method and enter the required information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={calculationMethod} onValueChange={(val) => { setCalculationMethod(val as 'lmp' | 'conception'); resetCalculator(); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lmp">Last Menstrual Period</TabsTrigger>
            <TabsTrigger value="conception">Conception Date</TabsTrigger>
          </TabsList>
          <TabsContent value="lmp" className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label>First Day of Your Last Menstrual Period</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !lastMenstrualPeriod && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastMenstrualPeriod ? format(lastMenstrualPeriod, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={lastMenstrualPeriod} onSelect={setLastMenstrualPeriod} initialFocus disabled={(date) => date > new Date()} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
              <Input id="cycle-length" type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g. 28" />
            </div>
          </TabsContent>
          <TabsContent value="conception" className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label>Estimated Conception Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !conceptionDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {conceptionDate ? format(conceptionDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={conceptionDate} onSelect={setConceptionDate} initialFocus disabled={(date) => date > new Date()} /></PopoverContent>
              </Popover>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex gap-4 pt-6">
          <Button onClick={calculateDueDate} className="w-full">Calculate Due Date</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {dueDate && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your estimated due date is:</p>
            <p className="text-3xl font-bold text-primary">{format(dueDate, 'MMMM d, yyyy')}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Please note: This is only an estimate. Your actual delivery date may vary. Consult with your healthcare provider.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
