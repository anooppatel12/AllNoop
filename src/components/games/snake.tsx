
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useInterval } from '@/hooks/use-interval';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const DIRECTIONS = {
  'ArrowUp': { x: 0, y: -1 },
  'ArrowDown': { x: 0, y: 1 },
  'ArrowLeft': { x: -1, y: 0 },
  'ArrowRight': { x: 1, y: 0 },
};

type Direction = keyof typeof DIRECTIONS;

const speedOptions = {
  slow: 150,
  medium: 100,
  fast: 75,
};
type Speed = keyof typeof speedOptions;


export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('ArrowRight');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState<Speed>('medium');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const newDirection = e.key as Direction;
    if (Object.keys(DIRECTIONS).includes(newDirection)) {
      e.preventDefault();
      // Prevent the snake from reversing
      if (
        (direction === 'ArrowUp' && newDirection === 'ArrowDown') ||
        (direction === 'ArrowDown' && newDirection === 'ArrowUp') ||
        (direction === 'ArrowLeft' && newDirection === 'ArrowRight') ||
        (direction === 'ArrowRight' && newDirection === 'ArrowLeft')
      ) {
        return;
      }
      setDirection(newDirection);
    }
  }, [direction]);

  const generateFood = useCallback(() => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (!isRunning || isGameOver) return;
    
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      const move = DIRECTIONS[direction];
      head.x += move.x;
      head.y += move.y;
      
      // Check for wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setIsGameOver(true);
        setIsRunning(false);
        return prevSnake;
      }

      // Check for self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }
      }

      newSnake.unshift(head);
      
      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food.x, food.y, generateFood, isGameOver, isRunning]);

  useInterval(moveSnake, isRunning ? speedOptions[speed] : null);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('ArrowRight');
    setIsGameOver(false);
    setScore(0);
    setIsRunning(true);
  }

  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isHead = snake[0].x === x && snake[0].y === y;
    const isFood = food.x === x && food.y === y;
    
    return (
      <div
        key={`${x}-${y}`}
        className={cn(
          "w-full h-full",
          isSnake ? (isHead ? "bg-primary" : "bg-primary/70") : "bg-muted",
          isFood && "bg-destructive rounded-full"
        )}
      />
    );
  };
  
  const handleVirtualControl = (dir: Direction) => {
      if(isRunning) {
        setDirection(dir);
      }
  }

  return (
    <Card className="mt-8 mx-auto max-w-lg">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Score: {score}</CardTitle>
        <div className="flex items-center gap-2">
            <p className="text-sm">Speed:</p>
            <Select value={speed} onValueChange={(v: Speed) => setSpeed(v)} disabled={isRunning}>
                <SelectTrigger className="w-[100px]"><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-20 w-full aspect-square border-2 border-primary bg-muted/50" style={{gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`}}>
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
                const x = i % BOARD_SIZE;
                const y = Math.floor(i / BOARD_SIZE);
                return renderCell(x, y);
            })}
             {isGameOver && (
                <div className="col-span-full row-span-full flex flex-col items-center justify-center bg-black/50 text-white z-10" style={{gridColumn: `1 / ${BOARD_SIZE+1}`, gridRow: `1 / ${BOARD_SIZE+1}`}}>
                    <p className="text-4xl font-bold">Game Over</p>
                    <p>Your score: {score}</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={startGame} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isGameOver ? 'Play Again' : 'Start Game'}
        </Button>
         <div className="flex flex-col items-center gap-2">
            <Button size="icon" onClick={() => handleVirtualControl('ArrowUp')}><ArrowUp/></Button>
            <div className="flex gap-2">
                <Button size="icon" onClick={() => handleVirtualControl('ArrowLeft')}><ArrowLeft/></Button>
                <Button size="icon" onClick={() => handleVirtualControl('ArrowDown')}><ArrowDown/></Button>
                <Button size="icon" onClick={() => handleVirtualControl('ArrowRight')}><ArrowRight/></Button>
            </div>
         </div>
      </CardFooter>
    </Card>
  );
}
