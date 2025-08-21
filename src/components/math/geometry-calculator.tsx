
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Shape = 'square' | 'rectangle' | 'circle';

export function GeometryCalculator() {
  const [shape, setShape] = useState<Shape>('square');
  const [side, setSide] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [radius, setRadius] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number } | null>(null);

  const calculate = () => {
    setResult(null);
    let area = 0;
    let perimeter = 0;

    switch (shape) {
      case 'square':
        const s = parseFloat(side);
        if (s > 0) {
          area = s * s;
          perimeter = 4 * s;
        }
        break;
      case 'rectangle':
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (l > 0 && w > 0) {
          area = l * w;
          perimeter = 2 * (l + w);
        }
        break;
      case 'circle':
        const r = parseFloat(radius);
        if (r > 0) {
          area = Math.PI * r * r;
          perimeter = 2 * Math.PI * r;
        }
        break;
    }
    
    if (area > 0) {
      setResult({ area, perimeter });
    }
  };

  const resetCalculator = () => {
    setSide('');
    setLength('');
    setWidth('');
    setRadius('');
    setResult(null);
  };
  
  const handleShapeChange = (value: Shape) => {
    setShape(value);
    resetCalculator();
  }

  const renderInputs = () => {
    switch (shape) {
      case 'square':
        return (
          <div className="space-y-2">
            <Label htmlFor="side">Side</Label>
            <Input id="side" type="number" value={side} onChange={(e) => setSide(e.target.value)} placeholder="Enter side length" />
          </div>
        );
      case 'rectangle':
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Enter length" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Enter width" />
            </div>
          </div>
        );
      case 'circle':
        return (
          <div className="space-y-2">
            <Label htmlFor="radius">Radius</Label>
            <Input id="radius" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Enter radius" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>2D Shape Calculator</CardTitle>
        <CardDescription>Select a shape and enter its dimensions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Shape</Label>
          <Select onValueChange={handleShapeChange} defaultValue={shape}>
            <SelectTrigger>
              <SelectValue placeholder="Select a shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {renderInputs()}

        <div className="flex gap-4">
          <Button onClick={calculate} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg">Area:</p>
                <p className="text-3xl font-bold">{result.area.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-lg">{shape === 'circle' ? 'Circumference' : 'Perimeter'}:</p>
                <p className="text-3xl font-bold">{result.perimeter.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
