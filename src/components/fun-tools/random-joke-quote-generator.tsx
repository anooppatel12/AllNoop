
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

type Joke = {
  setup: string;
  punchline: string;
};

type Quote = {
  content: string;
  author: string;
};

export function RandomJokeQuoteGenerator() {
  const [mode, setMode] = useState<'joke' | 'quote'>('joke');
  const [joke, setJoke] = useState<Joke | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setIsLoading(true);
    setError(null);
    setJoke(null);
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!response.ok) throw new Error('Failed to fetch joke. Please try again.');
      const data: Joke = await response.json();
      setJoke(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    setQuote(null);
    try {
      // Using a different, more stable API for quotes
      const response = await fetch('https://api.freeapi.app/api/v1/public/quotes/random');
       if (!response.ok) throw new Error('Failed to fetch quote. Please try again.');
      const apiResponse = await response.json();

      if(apiResponse.success && apiResponse.data) {
        const data: Quote = apiResponse.data;
        setQuote(data);
      } else {
        throw new Error(apiResponse.message || 'Failed to parse quote data.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (mode === 'joke') {
      fetchJoke();
    } else {
      fetchQuote();
    }
  }, [mode]);

  const handleGenerate = () => {
    if (mode === 'joke') {
      fetchJoke();
    } else {
      fetchQuote();
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'joke' | 'quote')}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="joke">Random Joke</TabsTrigger>
                <TabsTrigger value="quote">Random Quote</TabsTrigger>
            </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="min-h-[150px] flex items-center justify-center">
        {isLoading && (
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Fetching...</p>
            </div>
        )}
        {error && (
             <Alert variant="destructive" className="w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {mode === 'joke' && joke && (
            <div className="text-center space-y-4">
                <p className="text-lg">{joke.setup}</p>
                <p className="text-xl font-bold text-primary">{joke.punchline}</p>
            </div>
        )}
        {mode === 'quote' && quote && (
            <div className="text-center space-y-4">
                <blockquote className="text-xl italic">"{quote.content}"</blockquote>
                <p className="text-md font-semibold text-muted-foreground">- {quote.author}</p>
            </div>
        )}
      </CardContent>
       <CardFooter>
            <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4"/>
                Generate New {mode === 'joke' ? 'Joke' : 'Quote'}
            </Button>
      </CardFooter>
    </Card>
  );
}
