
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, Trophy } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

const cardSymbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

type CardState = {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const createShuffledBoard = (): CardState[] => {
  const duplicatedSymbols = [...cardSymbols, ...cardSymbols];
  const shuffled = duplicatedSymbols
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
  return shuffled;
};

export function MemoryCardGame() {
  const [board, setBoard] = useState<CardState[]>(createShuffledBoard());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCard = board[firstCardIndex];
      const secondCard = board[secondCardIndex];

      if (firstCard.symbol === secondCard.symbol) {
        // It's a match
        setBoard(prevBoard =>
          prevBoard.map(card =>
            card.symbol === firstCard.symbol ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // Not a match, flip them back after a delay
        setTimeout(() => {
          setBoard(prevBoard =>
            prevBoard.map((card, index) =>
              index === firstCardIndex || index === secondCardIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, board]);
  
   useEffect(() => {
    const allMatched = board.every(card => card.isMatched);
    if (allMatched && board.length > 0) {
      setIsGameOver(true);
    }
  }, [board]);

  const handleCardClick = (index: number) => {
    if (isChecking || flippedCards.length === 2 || board[index].isFlipped) {
      return;
    }

    setBoard(prevBoard =>
      prevBoard.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, index]);
  };

  const restartGame = () => {
    setBoard(createShuffledBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsGameOver(false);
    setIsChecking(false);
  };

  return (
    <Card className="mt-8 mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Moves: {moves}</CardTitle>
            <Button onClick={restartGame} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {board.map((card, index) => (
            <div
              key={card.id}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-500",
                "transform-style-3d",
                card.isFlipped ? "rotate-y-180" : ""
              )}
              onClick={() => handleCardClick(index)}
            >
              <div className={cn("absolute w-full h-full backface-hidden rounded-lg",
                card.isMatched ? "bg-green-500/20" : "bg-primary")}>
              </div>
               <div className={cn("absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center text-4xl",
                 card.isMatched ? "bg-green-500/20" : "bg-secondary")}>
                {card.symbol}
              </div>
            </div>
          ))}
        </div>
        {isGameOver && (
          <Alert className="bg-green-100 dark:bg-green-900 border-green-500">
            <Trophy className="h-4 w-4" />
            <AlertTitle>Congratulations!</AlertTitle>
            <AlertDescription>
              You've matched all the cards in {moves} moves!
              <Button onClick={restartGame} className="mt-4 w-full">Play Again</Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Card className="w-full bg-muted/50 p-4">
            <CardTitle className="text-lg mb-2">How to Play</CardTitle>
            <CardDescription className="space-y-1 text-sm">
                <p><strong>Objective:</strong> Find all the matching pairs of cards.</p>
                <p>1. Click on a card to flip it over and reveal the symbol.</p>
                <p>2. Click on a second card to see if it's a match.</p>
                <p>3. If the symbols match, the cards will stay face up. If not, they will flip back over after a moment.</p>
                <p>4. Continue until all pairs have been found. The fewer moves you make, the better!</p>
            </CardDescription>
        </Card>
      </CardFooter>
      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </Card>
  );
}
