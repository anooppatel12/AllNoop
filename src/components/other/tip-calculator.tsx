
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState('15');
  const [numPeople, setNumPeople] = useState('1');
  const [totalTip, setTotalTip] = useState<number | null>(null);
  const [totalBill, setTotalBill] = useState<number | null>(null);
  const [tipPerPerson, setTipPerPerson] = useState<number | null>(null);
  const [totalPerPerson, setTotalPerPerson] = useState<number | null>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const people = parseInt(numPeople);

    if (bill > 0 && tip >= 0 && people > 0) {
      const tipAmount = (bill * tip) / 100;
      const finalBill = bill + tipAmount;
      const tipPer = tipAmount / people;
      const totalPer = finalBill / people;

      setTotalTip(tipAmount);
      setTotalBill(finalBill);
      setTipPerPerson(tipPer);
      setTotalPerPerson(totalPer);
    }
  };
  
  const resetCalculator = () => {
    setBillAmount('');
    setTipPercentage('15');
    setNumPeople('1');
    setTotalTip(null);
    setTotalBill(null);
    setTipPerPerson(null);
    setTotalPerPerson(null);
  };
  
  const handleTipButtonClick = (percentage: string) => {
    setTipPercentage(percentage);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Tip Calculator</CardTitle>
        <CardDescription>Calculate tip and split the bill.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bill-amount">Bill Amount ($)</Label>
          <Input
            id="bill-amount"
            type="number"
            placeholder="0.00"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
            <Label>Select Tip %</Label>
            <div className="grid grid-cols-3 gap-2">
                {['10', '15', '20'].map(p => (
                    <Button key={p} variant={tipPercentage === p ? 'default' : 'outline'} onClick={() => handleTipButtonClick(p)}>{p}%</Button>
                ))}
            </div>
        </div>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="custom-tip">Custom Tip (%)</Label>
                <Input
                id="custom-tip"
                type="number"
                placeholder="e.g. 18"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="num-people">Number of People</Label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    id="num-people"
                    type="number"
                    placeholder="1"
                    className="pl-10"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    />
                </div>
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateTip} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {totalBill !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Tip</span>
              <span className="text-2xl font-bold">${totalTip?.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-lg">Total Bill</span>
              <span className="text-2xl font-bold">${totalBill?.toFixed(2)}</span>
            </div>
            {parseInt(numPeople) > 1 && (
                 <>
                    <div className="border-t border-border my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg">Tip Per Person</span>
                        <span className="text-xl font-semibold">${tipPerPerson?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg">Total Per Person</span>
                        <span className="text-xl font-semibold">${totalPerPerson?.toFixed(2)}</span>
                    </div>
                 </>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
