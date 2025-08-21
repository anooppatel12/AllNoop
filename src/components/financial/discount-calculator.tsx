
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [savedAmount, setSavedAmount] = useState<number | null>(null);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercentage);

    if (!isNaN(price) && !isNaN(discount)) {
      const saved = (price * discount) / 100;
      const final = price - saved;
      setSavedAmount(saved);
      setFinalPrice(final);
    }
  };
  
  const resetCalculator = () => {
    setOriginalPrice('');
    setDiscountPercentage('');
    setFinalPrice(null);
    setSavedAmount(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Discount Calculator</CardTitle>
        <CardDescription>Calculate the final price after applying a discount.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="original-price">Original Price</Label>
            <Input
              id="original-price"
              type="number"
              placeholder="e.g. 100"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-percentage">Discount (%)</Label>
            <Input
              id="discount-percentage"
              type="number"
              placeholder="e.g. 15"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
            <Button onClick={calculateDiscount} className="w-full">Calculate</Button>
            <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {finalPrice !== null && savedAmount !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-lg">Final Price:</p>
                    <p className="text-3xl font-bold">${finalPrice.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-lg">You Saved:</p>
                    <p className="text-3xl font-bold text-green-600">${savedAmount.toFixed(2)}</p>
                </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
