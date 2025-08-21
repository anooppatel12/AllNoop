
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function EgfrCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [creatinineUnit, setCreatinineUnit] = useState<'mg_dl' | 'umol_l'>('mg_dl');
  const [egfr, setEgfr] = useState<number | null>(null);
  const [egfrCategory, setEgfrCategory] = useState('');

  const calculateEgfr = () => {
    const ageNum = parseInt(age);
    let creatinineVal = parseFloat(creatinine);

    if (isNaN(ageNum) || isNaN(creatinineVal) || ageNum <= 0 || creatinineVal <= 0) {
      setEgfr(null);
      setEgfrCategory('');
      return;
    }

    // Convert creatinine to mg/dL if it's in µmol/L
    if (creatinineUnit === 'umol_l') {
      creatinineVal /= 88.4;
    }

    let k, alpha;
    if (gender === 'female') {
      k = 0.7;
      alpha = -0.241;
    } else { // male
      k = 0.9;
      alpha = -0.302;
    }
    
    const scr_k_ratio = creatinineVal / k;
    
    const egfrValue = 142 * Math.pow(Math.min(scr_k_ratio, 1), alpha) * Math.pow(Math.max(scr_k_ratio, 1), -1.200) * Math.pow(0.9938, ageNum) * (gender === 'female' ? 1.012 : 1);

    setEgfr(egfrValue);
    setEgfrCategory(getEgfrCategory(egfrValue));
  };
  
  const getEgfrCategory = (value: number) => {
    if (value >= 90) return 'Stage 1: Normal or high GFR';
    if (value >= 60 && value < 90) return 'Stage 2: Mildly decreased GFR';
    if (value >= 45 && value < 60) return 'Stage 3a: Mildly to moderately decreased GFR';
    if (value >= 30 && value < 45) return 'Stage 3b: Moderately to severely decreased GFR';
    if (value >= 15 && value < 30) return 'Stage 4: Severely decreased GFR';
    return 'Stage 5: Kidney failure';
  };

  const resetCalculator = () => {
    setGender('female');
    setAge('');
    setCreatinine('');
    setEgfr(null);
    setEgfrCategory('');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>eGFR Calculator (CKD-EPI 2021)</CardTitle>
        <CardDescription>This calculator is for adults aged 18 and over.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input id="age" type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
        </div>
        <div className="space-y-2">
          <Label>Serum Creatinine</Label>
           <div className="flex gap-2">
              <Input id="creatinine" type="number" placeholder="Enter value" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
               <Select onValueChange={(value: 'mg_dl' | 'umol_l') => setCreatinineUnit(value)} defaultValue={creatinineUnit}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg_dl">mg/dL</SelectItem>
                  <SelectItem value="umol_l">µmol/L</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={calculateEgfr} className="w-full">Calculate eGFR</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {egfr !== null && (
        <CardFooter>
            <div className="w-full rounded-lg bg-muted p-4 text-center">
                <p className="text-lg">Your estimated GFR is:</p>
                <p className="text-3xl font-bold">{egfr.toFixed(0)}</p>
                <p className="mt-1 text-sm text-muted-foreground">mL/min/1.73m²</p>
                <p className="mt-4 text-lg font-semibold">{egfrCategory}</p>
                 <p className="mt-4 text-xs text-muted-foreground">
                    This result is an estimate. Consult a healthcare professional for an accurate diagnosis.
                </p>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
