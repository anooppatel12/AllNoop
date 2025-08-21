
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function InterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  
  const [simpleInterest, setSimpleInterest] = useState<number | null>(null);
  const [totalSimple, setTotalSimple] = useState<number | null>(null);

  const [compoundInterest, setCompoundInterest] = useState<number | null>(null);
  const [totalCompound, setTotalCompound] = useState<number | null>(null);
  
  const calculateSimpleInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (p > 0 && r > 0 && t > 0) {
      const interest = p * r * t;
      setSimpleInterest(interest);
      setTotalSimple(p + interest);
    }
  };
  
  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (p > 0 && r > 0 && t > 0) {
      const total = p * Math.pow(1 + r, t);
      setCompoundInterest(total - p);
      setTotalCompound(total);
    }
  };

  const calculate = () => {
    calculateSimpleInterest();
    calculateCompoundInterest();
  }
  
  const reset = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setSimpleInterest(null);
    setTotalSimple(null);
    setCompoundInterest(null);
    setTotalCompound(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Interest Calculator</CardTitle>
        <CardDescription>Calculate Simple and Compound Interest.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal Amount ($)</Label>
            <Input id="principal" type="number" placeholder="1000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Annual Rate (%)</Label>
            <Input id="rate" type="number" placeholder="5" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time (Years)</Label>
            <Input id="time" type="number" placeholder="10" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
          <Button onClick={reset} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {(simpleInterest !== null || compoundInterest !== null) && (
        <CardFooter>
            <Tabs defaultValue="simple" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="simple">Simple Interest</TabsTrigger>
                    <TabsTrigger value="compound">Compound Interest</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                    {simpleInterest !== null && totalSimple !== null && (
                        <div className="w-full rounded-lg bg-muted p-4 text-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Interest Earned</p>
                                    <p className="text-xl font-semibold">${simpleInterest.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-xl font-semibold">${totalSimple.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="compound">
                    {compoundInterest !== null && totalCompound !== null && (
                         <div className="w-full rounded-lg bg-muted p-4 text-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Interest Earned</p>
                                    <p className="text-xl font-semibold">${compoundInterest.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-xl font-semibold">${totalCompound.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </CardFooter>
      )}
    </Card>
  );
}
