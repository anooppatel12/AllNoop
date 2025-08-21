
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const goals = {
  maintenance: { p: 30, c: 40, f: 30 },
  cutting: { p: 40, c: 30, f: 30 },
  bulking: { p: 30, c: 50, f: 20 },
};

type Goal = keyof typeof goals;

type Macros = { protein: number; carbs: number; fats: number; };

export function MacrosCalculator() {
  const [totalCalories, setTotalCalories] = useState('2000');
  const [goal, setGoal] = useState<Goal>('maintenance');
  const [result, setResult] = useState<Macros | null>(null);

  const calculateMacros = () => {
    const calories = parseFloat(totalCalories);
    if (isNaN(calories) || calories <= 0) {
      setResult(null);
      return;
    }

    const ratios = goals[goal];
    const proteinGrams = (calories * (ratios.p / 100)) / 4;
    const carbGrams = (calories * (ratios.c / 100)) / 4;
    const fatGrams = (calories * (ratios.f / 100)) / 9;

    setResult({ protein: proteinGrams, carbs: carbGrams, fats: fatGrams });
  };
  
  const resetCalculator = () => {
    setTotalCalories('2000');
    setGoal('maintenance');
    setResult(null);
  }
  
  const chartData = result ? [
      { name: 'Protein', value: result.protein, fill: 'hsl(var(--chart-1))' },
      { name: 'Carbs', value: result.carbs, fill: 'hsl(var(--chart-2))' },
      { name: 'Fats', value: result.fats, fill: 'hsl(var(--chart-3))' }
  ] : [];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Daily Macronutrient Split</CardTitle>
        <CardDescription>Determine your daily protein, carbohydrate, and fat intake in grams.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="calories-macros">Total Daily Calories (kcal)</Label>
                <Input id="calories-macros" type="number" placeholder="e.g. 2000" value={totalCalories} onChange={(e) => setTotalCalories(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>Your Goal</Label>
                <Select onValueChange={(value: Goal) => setGoal(value)} defaultValue={goal}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your primary goal"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                        <SelectItem value="cutting">Weight Loss (Cutting)</SelectItem>
                        <SelectItem value="bulking">Weight Gain (Bulking)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateMacros} className="w-full">Calculate Macros</Button>
           <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter className="flex-col gap-6">
            <div className="w-full rounded-lg bg-muted p-4 text-center">
                <h3 className="mb-4 text-lg font-semibold">Your Daily Macronutrient Targets (grams)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold" style={{color: 'hsl(var(--chart-1))'}}>{result.protein.toFixed(0)}g</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold" style={{color: 'hsl(var(--chart-2))'}}>{result.carbs.toFixed(0)}g</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Fats</p>
                        <p className="text-2xl font-bold" style={{color: 'hsl(var(--chart-3))'}}>{result.fats.toFixed(0)}g</p>
                    </div>
                </div>
            </div>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)"
                            }}
                        />
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
