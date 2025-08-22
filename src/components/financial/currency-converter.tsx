
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface Rates {
  [key: string]: number;
}

const popularCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL'];

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState<Rates | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch exchange rates. The API might be temporarily unavailable.');
        const data = await response.json();
        setExchangeRates(data.rates);
        setLastUpdated(new Date(data.time_last_updated * 1000).toLocaleString());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  const convert = useCallback(() => {
    if (!exchangeRates || !amount) {
      setResult(null);
      return;
    }
    const rate = exchangeRates[toCurrency];
    const numericAmount = parseFloat(amount);
    if (rate && !isNaN(numericAmount)) {
      setResult(numericAmount * rate);
    } else {
      setResult(null);
    }
  }, [exchangeRates, amount, toCurrency]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Currency Exchange</CardTitle>
        <CardDescription>Select currencies and enter an amount to convert.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Loading exchange rates...</p>
          </div>
        ) : error ? (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <Label>From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {exchangeRates && Object.keys(exchangeRates).map(curr => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSwapCurrencies} className="mt-8">
                  <ArrowRightLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 space-y-2">
                <Label>To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {exchangeRates && Object.keys(exchangeRates).map(curr => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {result !== null && !isLoading && !error && (
        <CardFooter className="flex-col gap-4">
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">{amount} {fromCurrency} =</p>
            <p className="text-4xl font-bold text-primary">
              {result.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} {toCurrency}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}. Rates are for informational purposes only.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
