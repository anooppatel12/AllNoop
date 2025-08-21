
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EmiCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayable, setTotalPayable] = useState<number | null>(null);

  const calculateEmi = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emiValue * n;
      const interest = totalAmount - p;
      
      setEmi(emiValue);
      setTotalPayable(totalAmount);
      setTotalInterest(interest);
    }
  };

  const resetCalculator = () => {
    setPrincipal('');
    setRate('');
    setTenure('');
    setEmi(null);
    setTotalInterest(null);
    setTotalPayable(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>Calculate your Equated Monthly Instalment for loans.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="principal">Loan Amount ($)</Label>
            <Input
              id="principal"
              type="number"
              placeholder="e.g. 100000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              placeholder="e.g. 8.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenure">Loan Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              placeholder="e.g. 10"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateEmi} className="w-full">Calculate EMI</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {emi !== null && totalInterest !== null && totalPayable !== null && (
        <CardFooter>
            <div className="w-full rounded-lg bg-muted p-4 text-center">
                <p className="text-lg">Monthly EMI:</p>
                <p className="text-3xl font-bold">${emi.toFixed(2)}</p>
                <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-xl font-semibold">${totalInterest.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Payable Amount</p>
                        <p className="text-xl font-semibold">${totalPayable.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
