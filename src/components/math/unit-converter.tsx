'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

const conversionOptions = {
  length: {
    label: 'Length',
    units: {
      meter: { name: 'Meter', toBase: 1 },
      kilometer: { name: 'Kilometer', toBase: 1000 },
      centimeter: { name: 'Centimeter', toBase: 0.01 },
      millimeter: { name: 'Millimeter', toBase: 0.001 },
      mile: { name: 'Mile', toBase: 1609.34 },
      yard: { name: 'Yard', toBase: 0.9144 },
      foot: { name: 'Foot', toBase: 0.3048 },
      inch: { name: 'Inch', toBase: 0.0254 },
    },
  },
  mass: {
    label: 'Mass',
    units: {
      kilogram: { name: 'Kilogram', toBase: 1 },
      gram: { name: 'Gram', toBase: 0.001 },
      milligram: { name: 'Milligram', toBase: 1e-6 },
      pound: { name: 'Pound', toBase: 0.453592 },
      ounce: { name: 'Ounce', toBase: 0.0283495 },
    },
  },
  temperature: {
    label: 'Temperature',
    units: {
      celsius: { name: 'Celsius' },
      fahrenheit: { name: 'Fahrenheit' },
      kelvin: { name: 'Kelvin' },
    },
  },
};

type ConversionType = keyof typeof conversionOptions;
type Unit<T extends ConversionType> = keyof (typeof conversionOptions)[T]['units'];

export function UnitConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>('length');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('kilometer');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  
  const convert = useCallback(() => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue('');
      return;
    }

    if (conversionType === 'temperature') {
      let tempInCelsius: number;
      if (fromUnit === 'celsius') tempInCelsius = value;
      else if (fromUnit === 'fahrenheit') tempInCelsius = (value - 32) * 5 / 9;
      else tempInCelsius = value - 273.15; // Kelvin

      let result: number;
      if (toUnit === 'celsius') result = tempInCelsius;
      else if (toUnit === 'fahrenheit') result = (tempInCelsius * 9 / 5) + 32;
      else result = tempInCelsius + 273.15; // Kelvin

      setToValue(result.toFixed(4));
    } else {
      const type = conversionType as 'length' | 'mass';
      const fromUnitData = conversionOptions[type].units[fromUnit as Unit<typeof type>];
      const toUnitData = conversionOptions[type].units[toUnit as Unit<typeof type>];
      
      if(fromUnitData && toUnitData) {
        const fromRate = fromUnitData.toBase;
        const toRate = toUnitData.toBase;
        const baseValue = value * fromRate;
        const result = baseValue / toRate;
        setToValue(result.toFixed(4));
      } else {
        setToValue('');
      }
    }
  }, [conversionType, fromUnit, toUnit, fromValue]);
  
  useEffect(() => {
    const units = Object.keys(conversionOptions[conversionType].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setFromValue('1');
  }, [conversionType]);

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, conversionType, convert]);
  

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Select a conversion type and enter values.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Conversion Type</Label>
          <Select onValueChange={(v: ConversionType) => setConversionType(v)} defaultValue={conversionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(conversionOptions).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label>From</Label>
            <Input type="number" value={fromValue} onChange={handleFromValueChange} />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(conversionOptions[conversionType].units).map(([key, unitData]) => (
                  <SelectItem key={key} value={key}>{(unitData as any).name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-8">
            <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-2">
            <Label>To</Label>
            <Input type="number" value={toValue} readOnly className="bg-muted" />
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(conversionOptions[conversionType].units).map(([key, unitData]) => (
                   <SelectItem key={key} value={key}>{(unitData as any).name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
