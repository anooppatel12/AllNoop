
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CostResult = {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
};

type HealthResult = {
  lifeLostDays: number;
  lifeLostYears: number;
};

export function SmokingCostCalculator() {
  const [cigsPerDay, setCigsPerDay] = useState('');
  const [costPerPack, setCostPerPack] = useState('');
  const [yearsSmoking, setYearsSmoking] = useState('');
  const [costResult, setCostResult] = useState<CostResult | null>(null);
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);

  const calculateCosts = () => {
    const dailyCigs = parseFloat(cigsPerDay);
    const packCost = parseFloat(costPerPack);
    const years = parseFloat(yearsSmoking);
    const cigsPerPack = 20;

    if (dailyCigs > 0 && packCost > 0 && years > 0) {
      const dailyCost = (dailyCigs / cigsPerPack) * packCost;
      const weeklyCost = dailyCost * 7;
      const monthlyCost = dailyCost * 30.44;
      const yearlyCost = dailyCost * 365.25;
      const totalCost = yearlyCost * years;
      
      setCostResult({
        daily: dailyCost,
        weekly: weeklyCost,
        monthly: monthlyCost,
        yearly: yearlyCost,
        total: totalCost
      });

      // Health cost calculation (11 minutes of life per cigarette)
      const totalCigsSmoked = dailyCigs * 365.25 * years;
      const minutesLost = totalCigsSmoked * 11;
      const daysLost = minutesLost / 60 / 24;
      const yearsLost = daysLost / 365.25;
      
      setHealthResult({
          lifeLostDays: daysLost,
          lifeLostYears: yearsLost
      });

    } else {
      setCostResult(null);
      setHealthResult(null);
    }
  };

  const resetCalculator = () => {
    setCigsPerDay('');
    setCostPerPack('');
    setYearsSmoking('');
    setCostResult(null);
    setHealthResult(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Smoking Cost Analysis</CardTitle>
        <CardDescription>Enter your smoking habits to see the financial and health impact.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cigs-per-day">Cigarettes per Day</Label>
            <Input id="cigs-per-day" type="number" placeholder="e.g., 20" value={cigsPerDay} onChange={(e) => setCigsPerDay(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost-per-pack">Cost per Pack ($)</Label>
            <Input id="cost-per-pack" type="number" placeholder="e.g., 8.50" value={costPerPack} onChange={(e) => setCostPerPack(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years-smoking">Years Smoking</Label>
            <Input id="years-smoking" type="number" placeholder="e.g., 10" value={yearsSmoking} onChange={(e) => setYearsSmoking(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateCosts} className="w-full">Calculate Cost</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {(costResult || healthResult) && (
        <CardFooter className="flex flex-col gap-6">
          {costResult && (
            <div className="w-full rounded-lg bg-muted p-4 text-center">
              <h3 className="mb-4 text-xl font-bold text-destructive">Financial Cost</h3>
              <div className="grid grid-cols-2 gap-4 text-left md:grid-cols-3">
                <div className="border-l-4 border-destructive pl-4">
                  <p className="text-sm text-muted-foreground">Daily</p>
                  <p className="text-lg font-semibold">${costResult.daily.toFixed(2)}</p>
                </div>
                <div className="border-l-4 border-destructive pl-4">
                  <p className="text-sm text-muted-foreground">Weekly</p>
                  <p className="text-lg font-semibold">${costResult.weekly.toFixed(2)}</p>
                </div>
                <div className="border-l-4 border-destructive pl-4">
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <p className="text-lg font-semibold">${costResult.monthly.toFixed(2)}</p>
                </div>
                <div className="border-l-4 border-destructive pl-4">
                  <p className="text-sm text-muted-foreground">Yearly</p>
                  <p className="text-lg font-semibold">${costResult.yearly.toFixed(2)}</p>
                </div>
                <div className="col-span-2 border-l-4 border-destructive bg-destructive/10 p-4 md:col-span-1">
                  <p className="text-sm text-muted-foreground">Total ({yearsSmoking} years)</p>
                  <p className="text-2xl font-bold">${costResult.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          {healthResult && (
            <div className="w-full rounded-lg bg-muted p-4 text-center">
              <h3 className="mb-4 text-xl font-bold text-destructive">Health Cost</h3>
              <p className="text-lg">Based on your habits, you have potentially lost:</p>
              <p className="mt-2 text-3xl font-bold text-destructive">
                {healthResult.lifeLostYears.toFixed(1)} years of your life
              </p>
              <p className="text-sm text-muted-foreground">({healthResult.lifeLostDays.toFixed(0)} days)</p>
              <p className="mt-4 text-xs text-muted-foreground">*Based on an estimate of 11 minutes lost per cigarette.</p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
