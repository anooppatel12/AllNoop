
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, Check, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type SudokuBoard = (number | null)[][];
type Difficulty = 'easy' | 'medium' | 'hard';

// A simple Sudoku generator/solver
const sudoku = {
  generate: (difficulty: Difficulty = 'medium'): { puzzle: SudokuBoard, solution: SudokuBoard } => {
    const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    const solution: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Fill the diagonal 3x3 boxes
    for (let i = 0; i < 9; i = i + 3) {
      sudoku.fillBox(board, i, i);
    }
    
    // Fill the remaining cells
    sudoku.fillRemaining(board, 0, 3);
    
    // Copy to solution
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            solution[i][j] = board[i][j];
        }
    }

    // Remove digits to create the puzzle
    let attempts: number;
    switch (difficulty) {
        case 'easy': attempts = 35; break;
        case 'medium': attempts = 45; break;
        case 'hard': attempts = 55; break;
        default: attempts = 45;
    }

    let count = attempts;
    while (count > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== null) {
        board[row][col] = null;
        count--;
      }
    }
    
    return { puzzle: board, solution };
  },

  fillBox: (board: SudokuBoard, row: number, col: number): void => {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!sudoku.isSafeInBox(board, row, col, num));
        board[row + i][col + j] = num;
      }
    }
  },

  isSafeInBox: (board: SudokuBoard, row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[row + i][col + j] === num) {
          return false;
        }
      }
    }
    return true;
  },
  
  isSafe: (board: SudokuBoard, row: number, col: number, num: number): boolean => {
    for (let x = 0; x <= 8; x++) if (board[row][x] === num) return false;
    for (let x = 0; x <= 8; x++) if (board[x][col] === num) return false;

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (board[i + startRow][j + startCol] === num) return false;

    return true;
  },

  fillRemaining: (board: SudokuBoard, i: number, j: number): boolean => {
    if (i === 8 && j === 9) return true;
    if (j === 9) { i++; j = 0; }
    if (board[i][j] !== null) return sudoku.fillRemaining(board, i, j + 1);

    for (let num = 1; num <= 9; num++) {
      if (sudoku.isSafe(board, i, j, num)) {
        board[i][j] = num;
        if (sudoku.fillRemaining(board, i, j + 1)) return true;
        board[i][j] = null;
      }
    }
    return false;
  },
};

export function SudokuGame() {
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>([]);
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [solution, setSolution] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [status, setStatus] = useState<'unsolved' | 'solved' | 'error'>('unsolved');

  const startNewGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = sudoku.generate(diff);
    setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
    setBoard(JSON.parse(JSON.stringify(puzzle)));
    setSolution(sol);
    setSelectedCell(null);
    setStatus('unsolved');
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [startNewGame, difficulty]);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === null) {
      setSelectedCell({ row, col });
    }
  };
  
  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[selectedCell.row][selectedCell.col] = num;
      setBoard(newBoard);
    }
  };

  const handleErase = () => {
    if(selectedCell) {
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[selectedCell.row][selectedCell.col] = null;
        setBoard(newBoard);
    }
  }

  const checkSolution = () => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== solution[i][j]) {
                setStatus('error');
                return;
            }
        }
    }
    setStatus('solved');
  };

  const showSolution = () => {
    setBoard(solution);
    setStatus('solved');
  }

  return (
    <Card className="mt-8 mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">Sudoku Challenge</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-9 w-full aspect-square border-2 border-primary">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isInitial = initialBoard[rowIndex]?.[colIndex] !== null;
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isRelated = selectedCell && (selectedCell.row === rowIndex || selectedCell.col === colIndex || (Math.floor(selectedCell.row/3) === Math.floor(rowIndex/3) && Math.floor(selectedCell.col/3) === Math.floor(colIndex/3)));
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    "flex items-center justify-center text-2xl font-semibold w-full h-full border border-muted",
                    "border-r-2 border-b-2",
                    (colIndex + 1) % 3 === 0 && "border-r-primary",
                    (rowIndex + 1) % 3 === 0 && "border-b-primary",
                    colIndex === 0 && "border-l-2 border-l-primary",
                    rowIndex === 0 && "border-t-2 border-t-primary",
                    isInitial ? "bg-muted text-foreground" : "cursor-pointer text-primary",
                    isSelected ? "bg-primary/20" : isRelated ? "bg-primary/5" : "bg-background",
                    "hover:bg-primary/10 transition-colors"
                  )}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>
        <div className="grid grid-cols-5 gap-2 w-full">
            <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground">Difficulty</p>
                <Select value={difficulty} onValueChange={(v: Difficulty) => setDifficulty(v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-end gap-2 col-span-3">
                 {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                    <Button key={num} variant="outline" size="icon" onClick={() => handleNumberInput(num)}>{num}</Button>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {status === 'solved' && <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-500"><AlertTitle>Congratulations!</AlertTitle><AlertDescription>You have successfully solved the puzzle!</AlertDescription></Alert>}
        {status === 'error' && <Alert variant="destructive"><AlertTitle>Something's not quite right</AlertTitle><AlertDescription>Keep trying! You can do it.</AlertDescription></Alert>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <Button onClick={handleErase} variant="outline">Erase</Button>
            <Button onClick={checkSolution} variant="outline"><Check className="mr-2"/>Check</Button>
            <Button onClick={showSolution} variant="outline"><Lightbulb className="mr-2"/>Solve</Button>
            <Button onClick={() => startNewGame(difficulty)}><RefreshCw className="mr-2" />New Game</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
