
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Circle, RefreshCw } from 'lucide-react';

type Player = 'X' | 'O';
type Square = Player | null;

export function TicTacToe() {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const checkWinner = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a] as Player);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner('Draw');
    }
  };

  useEffect(() => {
    checkWinner();
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] || winner) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    return (
      <button
        key={index}
        className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-primary bg-background text-4xl font-bold transition-colors hover:bg-accent disabled:cursor-not-allowed"
        onClick={() => handleClick(index)}
        disabled={!!value || !!winner}
        aria-label={`Square ${index + 1}`}
      >
        {value === 'X' && <X className="h-16 w-16 text-red-500" />}
        {value === 'O' && <Circle className="h-12 w-12 text-blue-500" />}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner) {
      return winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`;
    }
    return `Current Player: ${currentPlayer}`;
  };

  return (
    <Card className="mt-8 mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-center">{getStatusMessage()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {board.map((_, index) => renderSquare(index))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </CardFooter>
    </Card>
  );
}
