
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type VariableToCalculate = 'm1' | 'v1' | 'm2' | 'v2';

export function DilutionCalculator() {
  const [variableToCalc, setVariableToCalc] = useState<VariableToCalculate>('m2');
  const [initialConcentration, setInitialConcentration] = useState(''); // M1
  const [initialVolume, setInitialVolume] = useState(''); // V1
  const [finalConcentration, setFinalConcentration] = useState(''); // M2
  const [finalVolume, setFinalVolume] = useState(''); // V2
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const m1 = parseFloat(initialConcentration);
    const v1 = parseFloat(initialVolume);
    const m2 = parseFloat(finalConcentration);
    const v2 = parseFloat(finalVolume);
    setResult(null);

    let calculatedValue: number | null = null;
    let resultString: string | null = null;

    switch (variableToCalc) {
      case 'm1':
        if (m2 > 0 && v2 > 0 && v1 > 0) {
          calculatedValue = (m2 * v2) / v1;
          resultString = `Initial Concentration (M₁) = ${calculatedValue.toFixed(4)} M`;
        }
        break;
      case 'v1':
        if (m2 > 0 && v2 > 0 && m1 > 0) {
          calculatedValue = (m2 * v2) / m1;
          resultString = `Initial Volume (V₁) = ${calculatedValue.toFixed(4)} L`;
        }
        break;
      case 'm2':
        if (m1 > 0 && v1 > 0 && v2 > 0) {
          calculatedValue = (m1 * v1) / v2;
          resultString = `Final Concentration (M₂) = ${calculatedValue.toFixed(4)} M`;
        }
        break;
      case 'v2':
        if (m1 > 0 && v1 > 0 && m2 > 0) {
          calculatedValue = (m1 * v1) / m2;
          resultString = `Final Volume (V₂) = ${calculatedValue.toFixed(4)} L`;
        }
        break;
    }
    
    setResult(resultString);
  };

  const resetCalculator = () => {
    setInitialConcentration('');
    setInitialVolume('');
    setFinalConcentration('');
    setFinalVolume('');
    setResult(null);
  };
  
  const handleVariableChange = (value: VariableToCalculate) => {
    setVariableToCalc(value);
    resetCalculator();
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Dilution Equation</CardTitle>
        <CardDescription>M₁V₁ = M₂V₂. Enter three values to calculate the fourth.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Which variable to calculate?</Label>
            <Select onValueChange={handleVariableChange} defaultValue={variableToCalc}>
                <SelectTrigger>
                    <SelectValue placeholder="Select variable"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="m1">Initial Concentration (M₁)</SelectItem>
                    <SelectItem value="v1">Initial Volume (V₁)</SelectItem>
                    <SelectItem value="m2">Final Concentration (M₂)</SelectItem>
                    <SelectItem value="v2">Final Volume (V₂)</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="m1">Initial Concentration (M₁)</Label>
                <Input id="m1" type="number" placeholder="Molarity (M)" value={initialConcentration} onChange={(e) => setInitialConcentration(e.target.value)} disabled={variableToCalc === 'm1'} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="v1">Initial Volume (V₁)</Label>
                <Input id="v1" type="number" placeholder="Volume (L)" value={initialVolume} onChange={(e) => setInitialVolume(e.target.value)} disabled={variableToCalc === 'v1'} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="m2">Final Concentration (M₂)</Label>
                <Input id="m2" type="number" placeholder="Molarity (M)" value={finalConcentration} onChange={(e) => setFinalConcentration(e.target.value)} disabled={variableToCalc === 'm2'} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="v2">Final Volume (V₂)</Label>
                <Input id="v2" type="number" placeholder="Volume (L)" value={finalVolume} onChange={(e) => setFinalVolume(e.target.value)} disabled={variableToCalc === 'v2'} />
            </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
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
