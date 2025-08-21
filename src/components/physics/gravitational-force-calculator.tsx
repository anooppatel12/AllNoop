
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const G = 6.67430e-11; // Gravitational constant

export function GravitationalForceCalculator() {
  const [mass1, setMass1] = useState('');
  const [mass2, setMass2] = useState('');
  const [distance, setDistance] = useState('');
  const [force, setForce] = useState<number | null>(null);

  const calculateForce = () => {
    const m1 = parseFloat(mass1);
    const m2 = parseFloat(mass2);
    const r = parseFloat(distance);

    if (m1 > 0 && m2 > 0 && r > 0) {
      const calculatedForce = (G * m1 * m2) / (r * r);
      setForce(calculatedForce);
    } else {
      setForce(null);
    }
  };

  const resetCalculator = () => {
    setMass1('');
    setMass2('');
    setDistance('');
    setForce(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Gravitational Force</CardTitle>
        <CardDescription>F = G * (m₁ * m₂) / r²</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mass1">Mass of Object 1 (kg)</Label>
            <Input
              id="mass1"
              type="number"
              placeholder="e.g., 5.972e24 (Earth)"
              value={mass1}
              onChange={(e) => setMass1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mass2">Mass of Object 2 (kg)</Label>
            <Input
              id="mass2"
              type="number"
              placeholder="e.g., 7.347e22 (Moon)"
              value={mass2}
              onChange={(e) => setMass2(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="distance">Distance between centers (m)</Label>
            <Input
              id="distance"
              type="number"
              placeholder="e.g., 3.844e8 (Earth-Moon)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateForce} className="w-full">Calculate Force</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {force !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Resulting Gravitational Force:</p>
            <p className="text-3xl font-bold">{force.toExponential(4)} N</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
