
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function CarbohydrateIntakeCalculator() {
  const [totalCalories, setTotalCalories] = useState('2000');
  const [carbPercentage, setCarbPercentage] = useState([45, 55]);
  const [carbIntake, setCarbIntake] = useState<{ min: number; max: number } | null>(null);

  const calculateCarbIntake = () => {
    const calories = parseFloat(totalCalories);
    if (isNaN(calories) || calories <= 0) {
      setCarbIntake(null);
      return;
    }

    // 1 gram of carbohydrate = 4 calories
    const minCarbCalories = calories * (carbPercentage[0] / 100);
    const maxCarbCalories = calories * (carbPercentage[1] / 100);
    
    const minGrams = minCarbCalories / 4;
    const maxGrams = maxCarbCalories / 4;

    setCarbIntake({ min: minGrams, max: maxGrams });
  };
  
  const resetCalculator = () => {
      setTotalCalories('2000');
      setCarbPercentage([45, 55]);
      setCarbIntake(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Daily Carbohydrate Needs</CardTitle>
        <CardDescription>Estimate your carb requirements based on total daily calorie consumption.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="total-calories">Total Daily Calorie Intake (kcal)</Label>
          <Input
            id="total-calories"
            type="number"
            placeholder="e.g., 2000"
            value={totalCalories}
            onChange={(e) => setTotalCalories(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Percentage of Calories from Carbs</Label>
            <span className="text-sm font-medium text-primary">{carbPercentage[0]}% - {carbPercentage[1]}%</span>
          </div>
          <Slider
            value={carbPercentage}
            onValueChange={setCarbPercentage}
            max={100}
            step={1}
            minStepsBetweenThumbs={5}
          />
          <p className="text-xs text-muted-foreground">General recommendation is 45-65% of total calories.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateCarbIntake} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {carbIntake && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your recommended daily carbohydrate intake is:</p>
            <p className="text-3xl font-bold text-primary">
              {carbIntake.min.toFixed(0)} - {carbIntake.max.toFixed(0)} grams
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
