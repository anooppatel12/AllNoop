
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';


export function GuessTheNumberGame() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const startNewGame = useCallback(() => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setAttempts(0);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100.');
      return;
    }

    setAttempts(prev => prev + 1);
    
    if (numGuess < randomNumber) {
      setMessage('Too low! Try again.');
    } else if (numGuess > randomNumber) {
      setMessage('Too high! Try again.');
    } else {
      setMessage(`Correct! You guessed it in ${attempts + 1} attempts.`);
      setIsGameOver(true);
    }
    setGuess('');
  };

  const getMessageColor = () => {
      if(message.includes('Correct')) return 'text-green-500';
      if(message.includes('high') || message.includes('low')) return 'text-orange-500';
      return 'text-destructive';
  }
  
  const getMessageIcon = () => {
      if(message.includes('Correct')) return <CheckCircle className="h-5 w-5 mr-2"/>;
      if(message.includes('high')) return <ArrowUp className="h-5 w-5 mr-2"/>;
      if(message.includes('low')) return <ArrowDown className="h-5 w-5 mr-2"/>;
      return null;
  }

  return (
    <Card className="mt-8 mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Guess The Number!</CardTitle>
        <CardDescription className="text-center">Enter your guess from 1 to 100.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="guess-input">Your Guess</Label>
            <Input
              id="guess-input"
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Enter a number"
              disabled={isGameOver}
            />
        </div>
        <Button onClick={handleGuess} disabled={isGameOver} className="w-full">
            Submit Guess
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {message && (
             <Alert className={cn(
                "flex items-center",
                isGameOver ? 'border-green-500 bg-green-500/10' : ''
             )}>
                {getMessageIcon()}
                <AlertDescription className={cn("font-semibold", getMessageColor())}>
                    {message}
                </AlertDescription>
             </Alert>
        )}
        <Button onClick={startNewGame} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          {isGameOver ? 'Play Again' : 'Restart Game'}
        </Button>
      </CardFooter>
    </Card>
  );
}
