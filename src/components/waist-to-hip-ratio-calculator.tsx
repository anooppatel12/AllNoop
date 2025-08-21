
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WaistToHipRatioCalculator() {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [whr, setWhr] = useState<number | null>(null);
  const [risk, setRisk] = useState<string | null>(null);

  const calculateWHR = () => {
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (waistVal > 0 && hipVal > 0) {
      const ratio = waistVal / hipVal;
      setWhr(ratio);

      let riskLevel = 'Low Risk';
      if (gender === 'male') {
        if (ratio >= 0.96 && ratio <= 1.0) riskLevel = 'Moderate Risk';
        if (ratio > 1.0) riskLevel = 'High Risk';
      } else { // female
        if (ratio >= 0.81 && ratio <= 0.85) riskLevel = 'Moderate Risk';
        if (ratio > 0.85) riskLevel = 'High Risk';
      }
      setRisk(riskLevel);
    } else {
        setWhr(null);
        setRisk(null);
    }
  };
  
  const resetCalculator = () => {
    setWaist('');
    setHip('');
    setWhr(null);
    setRisk(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Waist-to-Hip Ratio (WHR)</CardTitle>
        <CardDescription>Enter your measurements to calculate your WHR.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Units</Label>
            <RadioGroup value={unit} onValueChange={(v: 'cm' | 'in') => setUnit(v)} className="flex h-10 items-center gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="cm" id="cm-whr" /><Label htmlFor="cm-whr">cm</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="in" id="in-whr" /><Label htmlFor="in-whr">in</Label></div>
            </RadioGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="waist-whr">Waist Circumference ({unit})</Label>
            <Input id="waist-whr" type="number" value={waist} onChange={(e) => setWaist(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hip-whr">Hip Circumference ({unit})</Label>
            <Input id="hip-whr" type="number" value={hip} onChange={(e) => setHip(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={calculateWHR} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {whr !== null && risk !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your Waist-to-Hip Ratio is:</p>
            <p className="text-3xl font-bold">{whr.toFixed(2)}</p>
            <p className="mt-2 text-lg font-semibold">Health Risk: <span className="text-primary">{risk}</span></p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
