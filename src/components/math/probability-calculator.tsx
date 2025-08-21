
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ProbabilityCalculator() {
  const [outcomes, setOutcomes] = useState('');
  const [totalOutcomes, setTotalOutcomes] = useState('');
  const [probability, setProbability] = useState<{ percentage: number; decimal: number } | null>(null);

  const calculateProbability = () => {
    const numOutcomes = parseInt(outcomes);
    const numTotalOutcomes = parseInt(totalOutcomes);

    if (numOutcomes >= 0 && numTotalOutcomes > 0 && numOutcomes <= numTotalOutcomes) {
      const decimal = numOutcomes / numTotalOutcomes;
      const percentage = decimal * 100;
      setProbability({ percentage, decimal });
    } else {
      setProbability(null);
    }
  };

  const resetCalculator = () => {
    setOutcomes('');
    setTotalOutcomes('');
    setProbability(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Probability of a Single Event</CardTitle>
        <CardDescription>P(A) = Number of Favorable Outcomes / Total Number of Outcomes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="outcomes">Number of Favorable Outcomes</Label>
            <Input
              id="outcomes"
              type="number"
              placeholder="e.g., 1 (for a specific face on a die)"
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-outcomes">Total Number of Outcomes</Label>
            <Input
              id="total-outcomes"
              type="number"
              placeholder="e.g., 6 (for a standard die)"
              value={totalOutcomes}
              onChange={(e) => setTotalOutcomes(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateProbability} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {probability !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Probability of the event:</p>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">As a Decimal</p>
                <p className="text-2xl font-bold">{probability.decimal.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">As a Percentage</p>
                <p className="text-2xl font-bold">{probability.percentage.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
