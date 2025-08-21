
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AlcoholUnitCalculator() {
  const [strength, setStrength] = useState(''); // ABV %
  const [volume, setVolume] = useState(''); // ml
  const [units, setUnits] = useState<number | null>(null);

  const calculateUnits = () => {
    const s = parseFloat(strength);
    const v = parseFloat(volume);

    if (s > 0 && v > 0) {
      const alcoholUnits = (s * v) / 1000;
      setUnits(alcoholUnits);
    } else {
      setUnits(null);
    }
  };

  const resetCalculator = () => {
    setStrength('');
    setVolume('');
    setUnits(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Alcohol Unit Calculator</CardTitle>
        <CardDescription>Units = (Strength (ABV) x Volume (ml)) / 1000</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strength">Strength (ABV %)</Label>
            <Input
              id="strength"
              type="number"
              placeholder="e.g., 5.2 for beer"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (ml)</Label>
            <Input
              id="volume"
              type="number"
              placeholder="e.g., 568 for a pint"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateUnits} className="w-full">Calculate Units</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {units !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Total alcohol units:</p>
            <p className="text-3xl font-bold">{units.toFixed(2)}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
