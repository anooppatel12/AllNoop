
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SquareRootCalculator() {
  const [number, setNumber] = useState('');
  const [square, setSquare] = useState<number | null>(null);
  const [squareRoot, setSquareRoot] = useState<number | null>(null);

  const calculate = () => {
    const num = parseFloat(number);
    if (!isNaN(num)) {
      setSquare(num * num);
      if (num >= 0) {
        setSquareRoot(Math.sqrt(num));
      } else {
        setSquareRoot(null); // Square root of negative number is not a real number
      }
    }
  };
  
  const resetCalculator = () => {
    setNumber('');
    setSquare(null);
    setSquareRoot(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Square & Square Root</CardTitle>
        <CardDescription>Enter a number to calculate its square and square root.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="number-input">Number</Label>
          <Input
            id="number-input"
            type="number"
            placeholder="e.g. 25"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
            <Button onClick={calculate} className="w-full">Calculate</Button>
            <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {(square !== null || squareRoot !== null) && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-lg">Square:</p>
                    <p className="text-3xl font-bold">{square?.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-lg">Square Root:</p>
                    <p className="text-3xl font-bold">{squareRoot?.toLocaleString()}</p>
                </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
