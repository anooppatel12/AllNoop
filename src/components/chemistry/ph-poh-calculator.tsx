
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PhPohCalculator() {
  const [activeTab, setActiveTab] = useState('ph');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const resetAll = () => {
    setInputValue('');
    setResult(null);
  };

  const calculate = () => {
    let res: number | null = null;
    let resString: string | null = null;
    const value = parseFloat(inputValue);

    if (isNaN(value)) {
      setResult(null);
      return;
    }

    switch(activeTab) {
        case 'ph': // Calculate from [H+]
            if (value > 0) {
                res = -Math.log10(value);
                const pOH = 14 - res;
                resString = `pH = ${res.toFixed(2)}, pOH = ${pOH.toFixed(2)}`;
            }
            break;
        case 'poh': // Calculate from [OH-]
            if (value > 0) {
                res = -Math.log10(value);
                const pH = 14 - res;
                resString = `pOH = ${res.toFixed(2)}, pH = ${pH.toFixed(2)}`;
            }
            break;
        case 'h_concentration': // Calculate from pH
            if (value >= 0 && value <= 14) {
                res = Math.pow(10, -value);
                const ohConc = 1e-14 / res;
                resString = `[H⁺] = ${res.toExponential(2)} M, [OH⁻] = ${ohConc.toExponential(2)} M`;
            }
            break;
        case 'oh_concentration': // Calculate from pOH
            if (value >= 0 && value <= 14) {
                res = Math.pow(10, -value);
                const hConc = 1e-14 / res;
                resString = `[OH⁻] = ${res.toExponential(2)} M, [H⁺] = ${hConc.toExponential(2)} M`;
            }
            break;
    }
    setResult(resString);
  }

  const renderInput = () => {
    switch(activeTab) {
        case 'ph':
            return { label: "H⁺ Concentration (M)", placeholder: "e.g., 1.0e-7" };
        case 'poh':
            return { label: "OH⁻ Concentration (M)", placeholder: "e.g., 1.0e-7" };
        case 'h_concentration':
            return { label: "pH", placeholder: "e.g., 7" };
        case 'oh_concentration':
            return { label: "pOH", placeholder: "e.g., 7" };
        default:
            return { label: "", placeholder: ""};
    }
  }
  
  const { label, placeholder } = renderInput();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Acidity/Basicity Calculator</CardTitle>
        <CardDescription>Select a calculation and enter the required value.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); resetAll(); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="ph">Calculate pH</TabsTrigger>
            <TabsTrigger value="poh">Calculate pOH</TabsTrigger>
            <TabsTrigger value="h_concentration">Calculate [H⁺]</TabsTrigger>
            <TabsTrigger value="oh_concentration">Calculate [OH⁻]</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="input-value">{label}</Label>
                <Input id="input-value" type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} />
            </div>

            <div className="flex gap-4">
              <Button onClick={calculate} className="w-full">Calculate</Button>
              <Button onClick={resetAll} className="w-full" variant="outline">Reset</Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Result:</p>
            <p className="text-2xl font-bold">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
