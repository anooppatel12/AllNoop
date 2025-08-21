
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityLevels = {
  sedentary: { value: 1.2, label: 'Sedentary (little to no exercise)' },
  light: { value: 1.375, label: 'Lightly active (light exercise/sports 1-3 days/week)' },
  moderate: { value: 1.55, label: 'Moderately active (moderate exercise/sports 3-5 days/week)' },
  active: { value: 1.725, label: 'Very active (hard exercise/sports 6-7 days a week)' },
  extra: { value: 1.9, label: 'Extra active (very hard exercise/physical job)' },
};

export function CalorieCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [activityLevel, setActivityLevel] = useState<keyof typeof activityLevels>('sedentary');
  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
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

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const calorieValue = bmr * activityLevels[activityLevel].value;
    setCalories(calorieValue);
  };
  
  const resetCalculator = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setHeightInches('');
    setCalories(null);
  }

  const handleUnitChange = (value: 'metric' | 'imperial') => {
    setUnit(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Daily Calorie Calculator</CardTitle>
        <CardDescription>Estimate your daily calorie needs to maintain your current weight.</CardDescription>
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

        <div className="space-y-2">
          <Label>Activity Level</Label>
          <Select onValueChange={(value: keyof typeof activityLevels) => setActivityLevel(value)} defaultValue={activityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(activityLevels).map(([key, {label}]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateCalories} className="w-full">Calculate Calories</Button>

        {calories !== null && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your estimated daily calorie need is:</p>
            <p className="text-3xl font-bold">{calories.toFixed(0)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Calories/day to maintain weight</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
