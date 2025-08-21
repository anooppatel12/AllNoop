
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const g = 9.80665; // acceleration due to gravity (m/s^2)

type ProjectileResult = {
  timeOfFlight: number;
  maxHeight: number;
  range: number;
};

export function ProjectileMotionCalculator() {
  const [initialVelocity, setInitialVelocity] = useState('');
  const [launchAngle, setLaunchAngle] = useState('');
  const [result, setResult] = useState<ProjectileResult | null>(null);

  const calculateMotion = () => {
    const v0 = parseFloat(initialVelocity);
    const angleDeg = parseFloat(launchAngle);

    if (v0 > 0 && angleDeg >= 0 && angleDeg <= 90) {
      const angleRad = angleDeg * (Math.PI / 180);
      
      const timeOfFlight = (2 * v0 * Math.sin(angleRad)) / g;
      const maxHeight = (Math.pow(v0 * Math.sin(angleRad), 2)) / (2 * g);
      const range = (Math.pow(v0, 2) * Math.sin(2 * angleRad)) / g;

      setResult({ timeOfFlight, maxHeight, range });
    } else {
      setResult(null);
    }
  };

  const resetCalculator = () => {
    setInitialVelocity('');
    setLaunchAngle('');
    setResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Projectile Motion</CardTitle>
        <CardDescription>Calculations assume launch from ground level (h=0) and no air resistance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="initial-velocity">Initial Velocity (m/s)</Label>
            <Input
              id="initial-velocity"
              type="number"
              placeholder="e.g., 50"
              value={initialVelocity}
              onChange={(e) => setInitialVelocity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="launch-angle">Launch Angle (°)</Label>
            <Input
              id="launch-angle"
              type="number"
              placeholder="e.g., 45"
              value={launchAngle}
              onChange={(e) => setLaunchAngle(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateMotion} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <h3 className="mb-4 text-lg font-semibold">Calculation Results</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Time of Flight</p>
                <p className="text-xl font-semibold">{result.timeOfFlight.toFixed(2)} s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maximum Height</p>
                <p className="text-xl font-semibold">{result.maxHeight.toFixed(2)} m</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Range</p>
                <p className="text-xl font-semibold">{result.range.toFixed(2)} m</p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
