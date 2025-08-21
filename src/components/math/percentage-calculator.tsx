
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function PercentageCalculator() {
  const [percentage, setPercentage] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentage = () => {
    const p = parseFloat(percentage);
    const v = parseFloat(baseValue);

    if (!isNaN(p) && !isNaN(v)) {
      setResult((p / 100) * v);
    }
  };

  const resetCalculator = () => {
    setPercentage('');
    setBaseValue('');
    setResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Percentage Calculator</CardTitle>
        <CardDescription>What is [percentage]% of [base value]?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage (%)</Label>
            <Input
              id="percentage"
              type="number"
              placeholder="e.g. 25"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base-value">Base Value</Label>
            <Input
              id="base-value"
              type="number"
              placeholder="e.g. 100"
              value={baseValue}
              onChange={(e) => setBaseValue(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculatePercentage} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Result:</p>
            <p className="text-3xl font-bold">{result.toLocaleString()}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
