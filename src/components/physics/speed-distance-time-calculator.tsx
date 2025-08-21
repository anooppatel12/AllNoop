
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CalculateOption = 'speed' | 'distance' | 'time';

export function SpeedDistanceTimeCalculator() {
  const [calculate, setCalculate] = useState<CalculateOption>('speed');
  const [speed, setSpeed] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const performCalculation = () => {
    const s = parseFloat(speed);
    const d = parseFloat(distance);
    const t = parseFloat(time);

    let calcResult = null;

    if (calculate === 'speed' && d > 0 && t > 0) {
      calcResult = `Speed: ${(d / t).toFixed(2)} units/time`;
    } else if (calculate === 'distance' && s > 0 && t > 0) {
      calcResult = `Distance: ${(s * t).toFixed(2)} units`;
    } else if (calculate === 'time' && d > 0 && s > 0) {
      calcResult = `Time: ${(d / s).toFixed(2)} time units`;
    }
    setResult(calcResult);
  };

  const resetCalculator = () => {
    setSpeed('');
    setDistance('');
    setTime('');
    setResult(null);
  };
  
  const handleCalculateChange = (value: CalculateOption) => {
    setCalculate(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Speed, Distance, Time</CardTitle>
        <CardDescription>Enter two values to calculate the third one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>What to Calculate?</Label>
          <Select onValueChange={handleCalculateChange} defaultValue={calculate}>
            <SelectTrigger>
              <SelectValue placeholder="Select what to calculate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speed">Speed</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="distance-input">Distance</Label>
                <Input id="distance-input" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 100" disabled={calculate === 'distance'}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="time-input">Time</Label>
                <Input id="time-input" type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2" disabled={calculate === 'time'}/>
            </div>
             <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="speed-input">Speed</Label>
                <Input id="speed-input" type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="e.g. 50" disabled={calculate === 'speed'}/>
            </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={performCalculation} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Result:</p>
            <p className="text-3xl font-bold">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
