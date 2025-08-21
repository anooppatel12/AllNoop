
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function IdealWeightCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [idealWeight, setIdealWeight] = useState<string | null>(null);

  const calculateIdealWeight = () => {
    let heightCm = 0;
    if (unit === 'metric') {
      heightCm = parseFloat(height);
    } else {
      const ft = parseFloat(height);
      const inches = parseFloat(heightInches);
      if(isNaN(ft) || isNaN(inches)) {
          setIdealWeight(null);
          return;
      }
      heightCm = (ft * 12 + inches) * 2.54;
    }

    if (heightCm > 0) {
      let weight = 0;
      // Using Robinson Formula
      if (gender === 'male') {
        weight = 52 + 1.9 * ((heightCm / 2.54) - 60);
      } else {
        weight = 49 + 1.7 * ((heightCm / 2.54) - 60);
      }
      
      if(unit === 'imperial'){
          weight *= 2.20462; // convert kg to lbs
      }

      setIdealWeight(`${weight.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`);
    } else {
      setIdealWeight(null);
    }
  };
  
  const resetCalculator = () => {
    setHeight('');
    setHeightInches('');
    setIdealWeight(null);
  }
  
  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Ideal Weight (Robinson Formula)</CardTitle>
        <CardDescription>Enter your height and gender to calculate your ideal weight.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Units</Label>
              <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex h-10 items-center gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="metric-iw" /><Label htmlFor="metric-iw">Metric (cm)</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="imperial" id="imperial-iw" /><Label htmlFor="imperial-iw">Imperial (ft, in)</Label></div>
              </RadioGroup>
            </div>
        </div>
        
        {unit === 'metric' ? (
            <div className="space-y-2">
                <Label htmlFor="height-cm">Height (cm)</Label>
                <Input id="height-cm" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="height-ft">Height (ft)</Label>
                    <Input id="height-ft" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="height-in">Height (in)</Label>
                    <Input id="height-in" type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
                </div>
            </div>
        )}

        <div className="flex gap-4">
          <Button onClick={calculateIdealWeight} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {idealWeight !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your Ideal Weight is estimated to be:</p>
            <p className="text-3xl font-bold text-primary">{idealWeight}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
