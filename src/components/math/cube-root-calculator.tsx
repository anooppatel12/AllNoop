
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CubeRootCalculator() {
  const [number, setNumber] = useState('');
  const [cube, setCube] = useState<number | null>(null);
  const [cubeRoot, setCubeRoot] = useState<number | null>(null);

  const calculate = () => {
    const num = parseFloat(number);
    if (!isNaN(num)) {
      setCube(num * num * num);
      setCubeRoot(Math.cbrt(num));
    }
  };
  
  const resetCalculator = () => {
    setNumber('');
    setCube(null);
    setCubeRoot(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Cube & Cube Root</CardTitle>
        <CardDescription>Enter a number to calculate its cube and cube root.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="number-input">Number</Label>
          <Input
            id="number-input"
            type="number"
            placeholder="e.g. 27"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
            <Button onClick={calculate} className="w-full">Calculate</Button>
            <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {(cube !== null || cubeRoot !== null) && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-lg">Cube:</p>
                    <p className="text-3xl font-bold">{cube?.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-lg">Cube Root:</p>
                    <p className="text-3xl font-bold">{cubeRoot?.toLocaleString(undefined, { maximumFractionDigits: 10 })}</p>
                </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
