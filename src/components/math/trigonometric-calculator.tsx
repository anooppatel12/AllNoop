
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type TrigValues = {
  sin: number | string;
  cos: number | string;
  tan: number | string;
  csc: number | string;
  sec: number | string;
  cot: number | string;
};

export function TrigonometricCalculator() {
  const [angle, setAngle] = useState('');
  const [values, setValues] = useState<TrigValues | null>(null);

  const calculateTrigValues = () => {
    const angleDeg = parseFloat(angle);
    if (isNaN(angleDeg)) {
        setValues(null);
        return;
    };

    const angleRad = angleDeg * (Math.PI / 180);

    const sinVal = Math.sin(angleRad);
    const cosVal = Math.cos(angleRad);
    const tanVal = Math.tan(angleRad);
    
    // Handle edge cases for tan, sec, cot, csc
    const is90Multiple = angleDeg % 90 === 0;
    const is180Multiple = angleDeg % 180 === 0;

    setValues({
      sin: sinVal,
      cos: cosVal,
      tan: is90Multiple && !is180Multiple ? 'Undefined' : tanVal,
      csc: sinVal === 0 ? 'Undefined' : 1 / sinVal,
      sec: cosVal === 0 ? 'Undefined' : 1 / cosVal,
      cot: tanVal === 0 ? 'Undefined' : 1 / tanVal,
    });
  };

  const resetCalculator = () => {
    setAngle('');
    setValues(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Trigonometric Functions</CardTitle>
        <CardDescription>Enter an angle in degrees to find its trigonometric values.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="angle">Angle (in degrees)</Label>
          <Input
            id="angle"
            type="number"
            placeholder="e.g. 45"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateTrigValues} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {values && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4">
            <h3 className="mb-4 text-center text-lg font-semibold">Results for {angle}°</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
              {Object.entries(values).map(([func, value]) => (
                <div key={func} className="flex justify-between border-b pb-2">
                  <span className="font-medium uppercase">{func}:</span>
                  <span className="font-mono">{typeof value === 'number' ? value.toFixed(6) : value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
