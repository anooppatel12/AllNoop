
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MolarityMolalityCalculator() {
  const [activeTab, setActiveTab] = useState('molarity');

  const [molesSolute, setMolesSolute] = useState('');
  const [litersSolution, setLitersSolution] = useState('');
  const [kgSolvent, setKgSolvent] = useState('');

  const [result, setResult] = useState<string | null>(null);

  const resetAll = () => {
    setMolesSolute('');
    setLitersSolution('');
    setKgSolvent('');
    setResult(null);
  };

  const calculate = () => {
    let res: number | null = null;
    let resString: string | null = null;

    const moles = parseFloat(molesSolute);
    const liters = parseFloat(litersSolution);
    const kg = parseFloat(kgSolvent);

    if (activeTab === 'molarity') {
      if (moles > 0 && liters > 0) {
        res = moles / liters;
        resString = `Molarity = ${res.toFixed(4)} M`;
      }
    } else { // molality
      if (moles > 0 && kg > 0) {
        res = moles / kg;
        resString = `Molality = ${res.toFixed(4)} m`;
      }
    }
    setResult(resString);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Solution Concentration</CardTitle>
        <CardDescription>Select a calculation and enter the required values.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); resetAll(); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="molarity">Molarity</TabsTrigger>
            <TabsTrigger value="molality">Molality</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-6">
            <TabsContent value="molarity" className="m-0 space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="moles-molarity">Moles of Solute (mol)</Label>
                  <Input id="moles-molarity" type="number" value={molesSolute} onChange={(e) => setMolesSolute(e.target.value)} placeholder="e.g., 0.5" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="liters-solution">Volume of Solution (L)</Label>
                  <Input id="liters-solution" type="number" value={litersSolution} onChange={(e) => setLitersSolution(e.target.value)} placeholder="e.g., 1.2" />
              </div>
            </TabsContent>
            <TabsContent value="molality" className="m-0 space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="moles-molality">Moles of Solute (mol)</Label>
                  <Input id="moles-molality" type="number" value={molesSolute} onChange={(e) => setMolesSolute(e.target.value)} placeholder="e.g., 0.5" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="kg-solvent">Mass of Solvent (kg)</Label>
                  <Input id="kg-solvent" type="number" value={kgSolvent} onChange={(e) => setKgSolvent(e.target.value)} placeholder="e.g., 0.8" />
              </div>
            </TabsContent>

            <div className="flex gap-4 pt-4">
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
            <p className="text-3xl font-bold">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
