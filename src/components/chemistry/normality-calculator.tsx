
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NormalityCalculator() {
  const [mass, setMass] = useState('');
  const [equivalentWeight, setEquivalentWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculateNormality = () => {
    const m = parseFloat(mass);
    const eq = parseFloat(equivalentWeight);
    const v = parseFloat(volume);

    if (m > 0 && eq > 0 && v > 0) {
      const normality = m / (eq * v);
      setResult(`Normality (N) = ${normality.toFixed(4)} N`);
    } else {
      setResult(null);
    }
  };

  const resetCalculator = () => {
    setMass('');
    setEquivalentWeight('');
    setVolume('');
    setResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Normality (N)</CardTitle>
        <CardDescription>
          N = Mass of Solute / (Equivalent Weight × Volume of Solution in Liters)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mass">Mass of Solute (g)</Label>
            <Input id="mass" type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g., 40" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equivalent-weight">Equivalent Weight (g/eq)</Label>
            <Input id="equivalent-weight" type="number" value={equivalentWeight} onChange={(e) => setEquivalentWeight(e.target.value)} placeholder="e.g., 40 for NaOH" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="volume">Volume of Solution (L)</Label>
            <Input id="volume" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="e.g., 1" />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateNormality} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Result:</p>
            <p className="text-3xl font-bold">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
