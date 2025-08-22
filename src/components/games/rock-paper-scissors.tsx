
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hand, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const icons: { [key in Choice]: string } = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

export function RockPaperScissorsGame() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const handlePlayerChoice = (choice: Choice) => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);

    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    setTimeout(() => {
        setPlayerChoice(choice);
        setComputerChoice(computerChoice);
    }, 100);

    setTimeout(() => {
        if (choice === computerChoice) {
            setResult('draw');
        } else if (
            (choice === 'rock' && computerChoice === 'scissors') ||
            (choice === 'scissors' && computerChoice === 'paper') ||
            (choice === 'paper' && computerChoice === 'rock')
        ) {
            setResult('win');
            setScores(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
            setResult('lose');
            setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
        }
    }, 500);
  };
  
  const getResultColor = () => {
      switch(result) {
          case 'win': return 'text-green-500';
          case 'lose': return 'text-destructive';
          case 'draw': return 'text-muted-foreground';
          default: return '';
      }
  }

  const resetGame = () => {
    setScores({ player: 0, computer: 0 });
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };
  
  const ChoiceDisplay = ({ choice, title }: { choice: Choice | null, title: string }) => (
    <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <motion.div
            key={choice}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-muted text-6xl shadow-inner"
        >
            {choice ? icons[choice] : '?'}
        </motion.div>
    </div>
  );

  return (
    <Card className="mt-8 mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle>Player: {scores.player} - Computer: {scores.computer}</CardTitle>
        <CardDescription>First to 5 wins!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex justify-around items-center min-h-[160px]">
            <ChoiceDisplay choice={playerChoice} title="You"/>
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className={cn("text-4xl font-bold", getResultColor())}
                    >
                        {result === 'win' ? 'You Win!' : result === 'lose' ? 'You Lose!' : 'Draw!'}
                    </motion.div>
                )}
            </AnimatePresence>
            <ChoiceDisplay choice={computerChoice} title="Computer"/>
        </div>
        <div className="flex justify-center gap-4">
          {choices.map(choice => (
            <Button
              key={choice}
              onClick={() => handlePlayerChoice(choice)}
              size="lg"
              className="h-20 w-20 rounded-full text-4xl"
              disabled={!!result}
            >
              {icons[choice]}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
}
