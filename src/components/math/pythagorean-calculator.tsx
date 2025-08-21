
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SideToCalculate = 'c' | 'a' | 'b';

export function PythagoreanCalculator() {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [sideToCalc, setSideToCalc] = useState<SideToCalculate>('c');

  const calculate = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);
    setResult(null);

    if (sideToCalc === 'c') {
      if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
        setResult(Math.sqrt(a * a + b * b));
      }
    } else if (sideToCalc === 'a') {
      if (!isNaN(b) && !isNaN(c) && c > b) {
        setResult(Math.sqrt(c * c - b * b));
      }
    } else { // sideToCalc === 'b'
      if (!isNaN(a) && !isNaN(c) && c > a) {
        setResult(Math.sqrt(c * c - a * a));
      }
    }
  };

  const resetCalculator = () => {
    setSideA('');
    setSideB('');
    setSideC('');
    setResult(null);
  };
  
  const handleSideToCalcChange = (value: SideToCalculate) => {
      setSideToCalc(value);
      resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Pythagorean Theorem</CardTitle>
        <CardDescription>a² + b² = c²</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Which side to calculate?</Label>
            <RadioGroup value={sideToCalc} onValueChange={handleSideToCalcChange} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="calc-c" />
                    <Label htmlFor="calc-c">Hypotenuse (c)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="calc-a" />
                    <Label htmlFor="calc-a">Side (a)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="calc-b" />
                    <Label htmlFor="calc-b">Side (b)</Label>
                </div>
            </RadioGroup>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="side-a">Side a</Label>
                <Input
                id="side-a"
                type="number"
                placeholder="Enter length of side a"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                disabled={sideToCalc === 'a'}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="side-b">Side b</Label>
                <Input
                id="side-b"
                type="number"
                placeholder="Enter length of side b"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                disabled={sideToCalc === 'b'}
                />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="side-c">Hypotenuse c</Label>
                <Input
                id="side-c"
                type="number"
                placeholder="Enter length of hypotenuse c"
                value={sideC}
                onChange={(e) => setSideC(e.target.value)}
                disabled={sideToCalc === 'c'}
                />
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">The length of side <strong>{sideToCalc}</strong> is:</p>
            <p className="text-3xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 10 })}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
