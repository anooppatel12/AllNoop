
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// MET values for various activities. (MET: Metabolic Equivalent of Task)
const activities = {
  running_5mph: { label: 'Running (5 mph / 12 min/mile)', met: 8.3 },
  running_7mph: { label: 'Running (7 mph / 8.5 min/mile)', met: 11.0 },
  cycling_leisure: { label: 'Cycling (leisure, <10 mph)', met: 4.0 },
  cycling_moderate: { label: 'Cycling (moderate, 12-14 mph)', met: 8.0 },
  walking_moderate: { label: 'Walking (moderate pace, 3 mph)', met: 3.5 },
  walking_brisk: { label: 'Walking (brisk pace, 4 mph)', met: 5.0 },
  swimming_freestyle: { label: 'Swimming (freestyle, light/moderate)', met: 7.0 },
  weightlifting_general: { label: 'Weightlifting (general)', met: 3.5 },
  yoga: { label: 'Yoga', met: 2.5 },
};

type ActivityKey = keyof typeof activities;

export function CalorieBurnCalculator() {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [duration, setDuration] = useState('');
  const [activity, setActivity] = useState<ActivityKey>('running_5mph');
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);

  const calculateCalories = () => {
    const weightVal = parseFloat(weight);
    const durationMin = parseFloat(duration);
    
    if (isNaN(weightVal) || weightVal <= 0 || isNaN(durationMin) || durationMin <= 0) {
      setCaloriesBurned(null);
      return;
    }

    const weightInKg = unit === 'lb' ? weightVal * 0.453592 : weightVal;
    const metValue = activities[activity].met;

    // Formula: Calories Burned/minute = (MET * body weight in kg * 3.5) / 200
    const caloriesPerMinute = (metValue * weightInKg * 3.5) / 200;
    const totalCalories = caloriesPerMinute * durationMin;

    setCaloriesBurned(totalCalories);
  };
  
  const resetCalculator = () => {
    setWeight('');
    setDuration('');
    setCaloriesBurned(null);
  }
  
  const handleUnitChange = (value: 'kg' | 'lb') => {
      setUnit(value);
      setWeight('');
      setCaloriesBurned(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Exercise Calorie Burn</CardTitle>
        <CardDescription>Estimate calories burned based on activity, duration, and weight.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div className="space-y-2">
              <Label htmlFor="weight-burn">Your Weight</Label>
              <Input id="weight-burn" type="number" placeholder="Enter your weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label>Unit</Label>
               <RadioGroup value={unit} onValueChange={handleUnitChange} className="flex h-10 items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id="kg-burn" />
                  <Label htmlFor="kg-burn">kg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lb" id="lb-burn" />
                  <Label htmlFor="lb-burn">lb</Label>
                </div>
              </RadioGroup>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label>Exercise Activity</Label>
                <Select onValueChange={(value: ActivityKey) => setActivity(value)} defaultValue={activity}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an activity"/>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(activities).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="e.g. 30" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateCalories} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {caloriesBurned !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">You burned approximately:</p>
            <p className="text-3xl font-bold text-primary">
              {caloriesBurned.toFixed(0)} calories
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
