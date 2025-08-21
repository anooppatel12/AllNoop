
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ForceWorkEnergyPowerCalculator() {
  const [activeTab, setActiveTab] = useState('force');

  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [work, setWork] = useState('');
  const [power, setPower] = useState('');
  const [time, setTime] = useState('');
  
  const [result, setResult] = useState<string | null>(null);
  
  const resetAll = () => {
    setMass('');
    setAcceleration('');
    setForce('');
    setDistance('');
    setWork('');
    setPower('');
    setTime('');
    setResult(null);
  };
  
  const calculate = () => {
    let res: number | null = null;
    let resString: string | null = null;
    
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);
    const f = parseFloat(force);
    const d = parseFloat(distance);
    const w = parseFloat(work);
    const p = parseFloat(power);
    const t = parseFloat(time);

    switch(activeTab) {
        case 'force':
            if (m > 0 && a > 0) {
                res = m * a;
                resString = `Force = ${res.toFixed(2)} N`;
            }
            break;
        case 'work':
            if (f > 0 && d > 0) {
                res = f * d;
                resString = `Work = ${res.toFixed(2)} J`;
            }
            break;
        case 'energy':
            if (p > 0 && t > 0) {
                res = p * t;
                resString = `Energy = ${res.toFixed(2)} J`;
            }
            break;
        case 'power':
            if (w > 0 && t > 0) {
                res = w / t;
                resString = `Power = ${res.toFixed(2)} W`;
            }
            break;
    }
    setResult(resString);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Physics Calculator</CardTitle>
        <CardDescription>Select a calculation and enter the required values.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); resetAll(); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="force">Force (F=ma)</TabsTrigger>
            <TabsTrigger value="work">Work (W=Fd)</TabsTrigger>
            <TabsTrigger value="energy">Energy (E=Pt)</TabsTrigger>
            <TabsTrigger value="power">Power (P=W/t)</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-6">
            <TabsContent value="force" className="m-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="mass-force">Mass (kg)</Label>
                        <Input id="mass-force" type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g., 10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="acceleration-force">Acceleration (m/s²)</Label>
                        <Input id="acceleration-force" type="number" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} placeholder="e.g., 9.8" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="work" className="m-0">
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="force-work">Force (N)</Label>
                        <Input id="force-work" type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="e.g., 100" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="distance-work">Distance (m)</Label>
                        <Input id="distance-work" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g., 5" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="energy" className="m-0">
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="power-energy">Power (W)</Label>
                        <Input id="power-energy" type="number" value={power} onChange={(e) => setPower(e.target.value)} placeholder="e.g., 1000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time-energy">Time (s)</Label>
                        <Input id="time-energy" type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 3600" />
                    </div>
                </div>
            </TabsContent>
             <TabsContent value="power" className="m-0">
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="work-power">Work (J)</Label>
                        <Input id="work-power" type="number" value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g., 5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time-power">Time (s)</Label>
                        <Input id="time-power" type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 10" />
                    </div>
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
