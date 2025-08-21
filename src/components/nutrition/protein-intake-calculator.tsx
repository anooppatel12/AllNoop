
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const activityLevels = {
  sedentary: { label: 'Sedentary (little or no exercise)', value: 0.8 },
  light: { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: 1.2 },
  moderate: { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: 1.4 },
  active: { label: 'Very active (hard exercise/sports 6-7 days a week)', value: 1.6 },
  extra: { label: 'Extra active (very hard exercise/physical job & training)', value: 1.8 }
};

export function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [activityLevel, setActivityLevel] = useState<keyof typeof activityLevels>('sedentary');
  const [proteinIntake, setProteinIntake] = useState<{ min: number; max: number } | null>(null);

  const calculateProteinIntake = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setProteinIntake(null);
      return;
    }

    const weightInKg = unit === 'lb' ? weightValue * 0.453592 : weightValue;
    const baseIntake = weightInKg * activityLevels[activityLevel].value;
    
    // Provide a range for more flexibility
    const minIntake = baseIntake;
    const maxIntake = baseIntake + (weightInKg * 0.2); // Upper range can be ~0.2g/kg higher

    setProteinIntake({ min: minIntake, max: maxIntake });
  };

  const resetCalculator = () => {
    setWeight('');
    setProteinIntake(null);
    setActivityLevel('sedentary');
  };
  
  const handleUnitChange = (value: 'kg' | 'lb') => {
      setUnit(value);
      setWeight('');
      setProteinIntake(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Daily Protein Needs</CardTitle>
        <CardDescription>Estimate how much protein you should be consuming each day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Your Weight</Label>
              <Input id="weight" type="number" placeholder="Enter your weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
               <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex h-10 items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id="kg" />
                  <Label htmlFor="kg">kg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lb" id="lb" />
                  <Label htmlFor="lb">lb</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        <div className="space-y-2">
          <Label>Activity Level</Label>
          <Select onValueChange={(value: keyof typeof activityLevels) => setActivityLevel(value)} defaultValue={activityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(activityLevels).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateProteinIntake} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {proteinIntake && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your recommended daily protein intake is:</p>
            <p className="text-3xl font-bold text-primary">
              {proteinIntake.min.toFixed(0)} - {proteinIntake.max.toFixed(0)} grams
            </p>
             <p className="mt-4 text-xs text-muted-foreground">
              This is an estimate. Individual needs may vary based on specific health goals, muscle mass, and age. Consult a nutritionist for personalized advice.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
