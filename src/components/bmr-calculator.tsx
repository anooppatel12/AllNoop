
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BmrCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [bmr, setBmr] = useState<number | null>(null);

  const calculateBmr = () => {
    const ageNum = parseInt(age);
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);

    if (isNaN(ageNum) || isNaN(weightKg) || isNaN(heightCm)) {
      return;
    }
    
    if (unit === 'imperial') {
      const heightFt = parseFloat(height);
      const heightIn = parseFloat(heightInches);
      if (isNaN(heightFt) || isNaN(heightIn)) return;

      heightCm = (heightFt * 12 + heightIn) * 2.54;
      weightKg = parseFloat(weight) * 0.453592;
    }

    let bmrValue: number;
    if (gender === 'male') {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }
    setBmr(bmrValue);
  };
  
  const resetCalculator = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setHeightInches('');
    setBmr(null);
  }

  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>BMR Calculator</CardTitle>
        <CardDescription>Calculate your Basal Metabolic Rate (BMR).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
        </div>
        <div className="space-y-2">
          <Label>Units</Label>
          <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metric" id="metric" />
              <Label htmlFor="metric">Metric (kg, cm)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="imperial" id="imperial" />
              <Label htmlFor="imperial">Imperial (lbs, ft, in)</Label>
            </div>
          </RadioGroup>
        </div>

        {unit === 'metric' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="height-metric">Height (cm)</Label>
              <Input id="height-metric" type="number" placeholder="Enter height in cm" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-metric">Weight (kg)</Label>
              <Input id="weight-metric" type="number" placeholder="Enter weight in kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="height-ft">Height (ft)</Label>
              <Input id="height-ft" type="number" placeholder="Feet" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-in">Height (in)</Label>
              <Input id="height-in" type="number" placeholder="Inches" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-imperial">Weight (lbs)</Label>
              <Input id="weight-imperial" type="number" placeholder="Pounds" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>
        )}

        <Button onClick={calculateBmr} className="w-full">Calculate BMR</Button>

        {bmr !== null && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your BMR is:</p>
            <p className="text-3xl font-bold">{bmr.toFixed(2)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Calories/day</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
