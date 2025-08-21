
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// Helper function for factorial
const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

export function PermutationCombinationCalculator() {
  const [totalItems, setTotalItems] = useState(''); // n
  const [chosenItems, setChosenItems] = useState(''); // r
  const [permutationResult, setPermutationResult] = useState<number | null>(null);
  const [combinationResult, setCombinationResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    setPermutationResult(null);
    setCombinationResult(null);

    const n = parseInt(totalItems);
    const r = parseInt(chosenItems);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
      setError('Please enter valid non-negative integers for n and r.');
      return;
    }

    if (r > n) {
      setError('The number of items to choose (r) cannot be greater than the total number of items (n).');
      return;
    }
    
    if (n > 20 || r > 20) { // Factorials of large numbers can cause overflow
        setError('Values of n and r greater than 20 may lead to inaccurate results due to computational limits.');
        // continue calculation but with a warning
    }

    // Permutation: n! / (n-r)!
    const perm = factorial(n) / factorial(n - r);
    setPermutationResult(perm);

    // Combination: n! / (r! * (n-r)!)
    const comb = perm / factorial(r);
    setCombinationResult(comb);
  };

  const resetCalculator = () => {
    setTotalItems('');
    setChosenItems('');
    setPermutationResult(null);
    setCombinationResult(null);
    setError(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Permutation & Combination</CardTitle>
        <CardDescription>Enter the total number of items (n) and the number of items to choose (r).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="total-items">Total Items (n)</Label>
            <Input
              id="total-items"
              type="number"
              placeholder="e.g. 10"
              value={totalItems}
              onChange={(e) => setTotalItems(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chosen-items">Items to Choose (r)</Label>
            <Input
              id="chosen-items"
              type="number"
              placeholder="e.g. 3"
              value={chosenItems}
              onChange={(e) => setChosenItems(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {error && (
        <CardFooter>
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardFooter>
      )}
      {(permutationResult !== null || combinationResult !== null) && !error && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-lg">Permutations (nPr):</p>
                <p className="text-3xl font-bold">{permutationResult?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-lg">Combinations (nCr):</p>
                <p className="text-3xl font-bold">{combinationResult?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
