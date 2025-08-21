
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BodyFatPercentageCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [bodyFat, setBodyFat] = useState<number | null>(null);

  const calculateBodyFat = () => {
    let h = parseFloat(height);
    let w = parseFloat(waist);
    let n = parseFloat(neck);
    let p = parseFloat(hip);

    if (unit === 'imperial') {
      h *= 2.54;
      w *= 2.54;
      n *= 2.54;
      p *= 2.54;
    }

    if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0 || isNaN(n) || n <= 0) {
        setBodyFat(null);
        return;
    }

    let bfp = 0;
    if (gender === 'male') {
      bfp = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else { // female
        if(isNaN(p) || p <= 0) {
            setBodyFat(null);
            return;
        }
      bfp = 495 / (1.29579 - 0.35004 * Math.log10(w + p - n) + 0.22100 * Math.log10(h)) - 450;
    }
    
    setBodyFat(bfp);
  };
  
  const resetCalculator = () => {
      setHeight('');
      setWaist('');
      setNeck('');
      setHip('');
      setBodyFat(null);
  }
  
  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Body Fat Calculator (U.S. Navy Method)</CardTitle>
        <CardDescription>Enter your measurements to estimate your body fat percentage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Units</Label>
              <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex h-10 items-center gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="metric-bf" /><Label htmlFor="metric-bf">Metric (cm)</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="imperial" id="imperial-bf" /><Label htmlFor="imperial-bf">Imperial (in)</Label></div>
              </RadioGroup>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="height-bf">Height ({unit === 'metric' ? 'cm' : 'in'})</Label>
                <Input id="height-bf" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="waist-bf">Waist ({unit === 'metric' ? 'cm' : 'in'})</Label>
                <Input id="waist-bf" type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="neck-bf">Neck ({unit === 'metric' ? 'cm' : 'in'})</Label>
                <Input id="neck-bf" type="number" value={neck} onChange={(e) => setNeck(e.target.value)} />
            </div>
            {gender === 'female' && (
                <div className="space-y-2">
                    <Label htmlFor="hip-bf">Hip ({unit === 'metric' ? 'cm' : 'in'})</Label>
                    <Input id="hip-bf" type="number" value={hip} onChange={(e) => setHip(e.target.value)} />
                </div>
            )}
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateBodyFat} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {bodyFat !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your estimated body fat is:</p>
            <p className="text-3xl font-bold text-primary">{bodyFat.toFixed(1)}%</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
