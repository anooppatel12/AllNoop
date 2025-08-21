
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function HeartRateCalculator() {
  const [age, setAge] = useState('25');
  const [intensity, setIntensity] = useState([50, 70]);
  const [result, setResult] = useState<{ lower: number; upper: number; max: number } | null>(null);

  const calculateHeartRate = () => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setResult(null);
      return;
    }

    const maxHeartRate = 220 - ageNum;
    const lowerBound = Math.round(maxHeartRate * (intensity[0] / 100));
    const upperBound = Math.round(maxHeartRate * (intensity[1] / 100));

    setResult({
      lower: lowerBound,
      upper: upperBound,
      max: maxHeartRate,
    });
  };
  
  useEffect(() => {
    calculateHeartRate();
  }, [age, intensity]);

  const resetCalculator = () => {
    setAge('25');
    setIntensity([50, 70]);
    setResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Calculate Your Target Zone</CardTitle>
        <CardDescription>Enter your age and select your desired exercise intensity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="age">Your Age</Label>
          <Input id="age" type="number" placeholder="Enter your age in years" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="space-y-4">
            <div className="flex justify-between">
                 <Label>Exercise Intensity</Label>
                 <span className="text-sm font-medium text-primary">{intensity[0]}% - {intensity[1]}%</span>
            </div>
            <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={5}
            />
             <div className="flex justify-between text-xs text-muted-foreground">
                <span>Light</span>
                <span>Moderate</span>
                <span>Vigorous</span>
            </div>
        </div>
         <Button onClick={calculateHeartRate} className="w-full">Calculate</Button>
      </CardContent>
      {result !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your Target Heart Rate Zone:</p>
            <p className="text-4xl font-bold text-primary">
              {result.lower} - {result.upper}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">beats per minute (BPM)</p>
            <div className="mt-4 border-t pt-4">
                 <p className="text-sm">Estimated Maximum Heart Rate: <span className="font-bold">{result.max} BPM</span></p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
