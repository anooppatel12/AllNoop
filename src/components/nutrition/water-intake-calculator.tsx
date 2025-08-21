
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityMultipliers = {
  sedentary: 1.0,
  light: 1.2,
  moderate: 1.4,
  active: 1.6,
  extra: 1.8
};

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [activityLevel, setActivityLevel] = useState<keyof typeof activityMultipliers>('sedentary');
  const [waterIntake, setWaterIntake] = useState<number | null>(null);

  const calculateWaterIntake = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setWaterIntake(null);
      return;
    }

    const weightInKg = unit === 'lb' ? weightValue * 0.453592 : weightValue;
    
    // Base formula: 35ml of water per kg of body weight
    const baseIntakeMl = weightInKg * 35;
    
    // Adjust for activity level
    const finalIntakeMl = baseIntakeMl * activityMultipliers[activityLevel];
    
    // Convert to liters
    setWaterIntake(finalIntakeMl / 1000);
  };
  
  const resetCalculator = () => {
      setWeight('');
      setActivityLevel('sedentary');
      setWaterIntake(null);
  }
  
  const handleUnitChange = (value: 'kg' | 'lb') => {
      setUnit(value);
      setWeight('');
      setWaterIntake(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Daily Water Intake</CardTitle>
        <CardDescription>Get a personalized recommendation for your daily water consumption.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div className="space-y-2">
              <Label htmlFor="weight-water">Your Weight</Label>
              <Input id="weight-water" type="number" placeholder="Enter your weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label>Unit</Label>
               <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex h-10 items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id="kg-water" />
                  <Label htmlFor="kg-water">kg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lb" id="lb-water" />
                  <Label htmlFor="lb-water">lb</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select onValueChange={(value: keyof typeof activityMultipliers) => setActivityLevel(value)} defaultValue={activityLevel}>
                <SelectTrigger>
                    <SelectValue placeholder="Select your activity level"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extra">Extra Active (very hard exercise/physical job)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateWaterIntake} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
       {waterIntake !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your estimated daily water intake is:</p>
            <p className="text-3xl font-bold text-primary">
              {waterIntake.toFixed(2)} Liters
            </p>
             <p className="mt-1 text-sm text-muted-foreground">
              (approx. {(waterIntake * 4.22).toFixed(1)} US cups)
            </p>
             <p className="mt-4 text-xs text-muted-foreground">
              Individual needs vary based on climate and health. Listen to your body.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
