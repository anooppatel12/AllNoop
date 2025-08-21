
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LeanBodyMassCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [lbm, setLbm] = useState<string | null>(null);

  const calculateLBM = () => {
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);

    if (unit === 'imperial') {
      heightCm *= 2.54;
      weightKg *= 0.453592;
    }

    if (heightCm > 0 && weightKg > 0) {
      let lbmValue = 0;
      if (gender === 'male') {
        lbmValue = 0.407 * weightKg + 0.267 * heightCm - 19.2;
      } else {
        lbmValue = 0.252 * weightKg + 0.473 * heightCm - 48.3;
      }

      const bodyFat = ((weightKg - lbmValue) / weightKg) * 100;
      
      let finalLbm = lbmValue;
      if (unit === 'imperial') {
        finalLbm *= 2.20462;
      }
      
      setLbm(`${finalLbm.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'} (Body Fat: ${bodyFat.toFixed(1)}%)`);
    } else {
      setLbm(null);
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setLbm(null);
  }

  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Lean Body Mass (Boer Formula)</CardTitle>
        <CardDescription>Enter your height, weight, and gender.</CardDescription>
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
              <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="metric-lbm" /><Label htmlFor="metric-lbm">Metric (cm, kg)</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="imperial" id="imperial-lbm" /><Label htmlFor="imperial-lbm">Imperial (in, lbs)</Label></div>
            </RadioGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="height-lbm">Height ({unit === 'metric' ? 'cm' : 'in'})</Label>
            <Input id="height-lbm" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight-lbm">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
            <Input id="weight-lbm" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateLBM} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {lbm !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your Lean Body Mass is estimated to be:</p>
            <p className="text-3xl font-bold text-primary">{lbm}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
