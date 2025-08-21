'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const calculateBmi = () => {
    let heightMeters: number;
    let weightKg: number;

    if (unit === 'metric') {
      if (!height || !weight) return;
      heightMeters = parseFloat(height) / 100;
      weightKg = parseFloat(weight);
    } else {
      if (!height || !heightInches || !weight) return;
      const totalInches = parseFloat(height) * 12 + parseFloat(heightInches);
      heightMeters = totalInches * 0.0254;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (heightMeters > 0 && weightKg > 0) {
      const bmiValue = weightKg / (heightMeters * heightMeters);
      setBmi(bmiValue);
      setBmiCategory(getBmiCategory(bmiValue));
    }
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    if (bmi >= 30) return 'Obese';
    return '';
  };
  
  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setHeightInches('');
    setBmi(null);
    setBmiCategory('');
  }
  
  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>Calculate your Body Mass Index (BMI).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Units</Label>
          <RadioGroup defaultValue="metric" onValueChange={handleUnitChange} className="flex gap-4">
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

        <Button onClick={calculateBmi} className="w-full">Calculate BMI</Button>

        {bmi !== null && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your BMI is:</p>
            <p className="text-3xl font-bold">{bmi.toFixed(2)}</p>
            <p className="mt-2 text-lg font-semibold">{bmiCategory}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
