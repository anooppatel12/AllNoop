
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type StatsResult = {
  mean: number;
  median: number;
  mode: string;
};

export function MeanMedianModeCalculator() {
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState<StatsResult | null>(null);

  const calculate = () => {
    const numbers = inputData
      .split(',')
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));

    if (numbers.length === 0) {
      setResult(null);
      return;
    }

    // Mean
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / numbers.length;

    // Median
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    for (const num of sorted) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
      }
    }

    let modes: number[] = [];
    if (maxFreq > 1) {
        for(const num in frequency) {
            if(frequency[num] === maxFreq) {
                modes.push(Number(num));
            }
        }
    }
    
    // Check if all numbers have same frequency
    const allSameFreq = Object.values(frequency).every(freq => freq === maxFreq);
    let modeString: string;
    if (modes.length === 0 || (allSameFreq && numbers.length > modes.length)) {
        modeString = 'N/A';
    } else {
        modeString = modes.join(', ');
    }
    
    setResult({ mean, median, mode: modeString });
  };

  const resetCalculator = () => {
    setInputData('');
    setResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Central Tendency Calculator</CardTitle>
        <CardDescription>Enter a comma-separated list of numbers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="data-input">Numbers</Label>
          <Textarea
            id="data-input"
            placeholder="e.g. 1, 2, 3, 4, 5, 5, 6"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={4}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <p className="text-lg font-semibold">Mean</p>
                    <p className="text-2xl font-bold">{result.mean.toFixed(4)}</p>
                </div>
                 <div>
                    <p className="text-lg font-semibold">Median</p>
                    <p className="text-2xl font-bold">{result.median.toFixed(4)}</p>
                </div>
                 <div>
                    <p className="text-lg font-semibold">Mode</p>
                    <p className="text-2xl font-bold">{result.mode}</p>
                </div>
             </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
