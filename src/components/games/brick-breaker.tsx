
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const BOARD_WIDTH = 480;
const BOARD_HEIGHT = 600;

// Paddle
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_Y = BOARD_HEIGHT - 40;
const PADDLE_SPEED = 10;

// Ball
const BALL_RADIUS = 8;

// Bricks
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 30;

type GameState = 'waiting' | 'playing' | 'gameover' | 'win';

type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status: 1 | 0; // 1 for active, 0 for broken
};

const brickColors = ["hsl(var(--destructive))", "hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-4))"];

export function BrickBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const paddleX = useRef(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const ball = useRef({
    x: BOARD_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS,
    dx: 4,
    dy: -4,
  });
  const bricks = useRef<Brick[]>([]);
  const rightPressed = useRef(false);
  const leftPressed = useRef(false);
  const animationFrameId = useRef<number>();
  
  const createBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        newBricks.push({
          x: c * (BRICK_WIDTH + BRICK_GAP) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: brickColors[r % brickColors.length],
          status: 1,
        });
      }
    }
    bricks.current = newBricks;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw Paddle
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.fillRect(paddleX.current, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(var(--card-foreground))';
    ctx.fill();
    ctx.closePath();
    
    // Draw Bricks
    bricks.current.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

  }, []);

  const resetGame = useCallback(() => {
    if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    createBricks();
    setScore(0);
    setLives(3);
    paddleX.current = (BOARD_WIDTH - PADDLE_WIDTH) / 2;
    ball.current = {
        x: BOARD_WIDTH / 2,
        y: PADDLE_Y - BALL_RADIUS,
        dx: 4,
        dy: -4
    };
    setGameState('playing');
  }, [createBricks]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Paddle movement
    if (rightPressed.current && paddleX.current < BOARD_WIDTH - PADDLE_WIDTH) {
      paddleX.current += PADDLE_SPEED;
    } else if (leftPressed.current && paddleX.current > 0) {
      paddleX.current -= PADDLE_SPEED;
    }
    
    // Ball movement and collision
    const b = ball.current;
    b.x += b.dx;
    b.y += b.dy;

    // Wall collision (left/right)
    if (b.x + b.dx > BOARD_WIDTH - BALL_RADIUS || b.x + b.dx < BALL_RADIUS) {
      b.dx = -b.dx;
    }

    // Wall collision (top)
    if (b.y + b.dy < BALL_RADIUS) {
      b.dy = -b.dy;
    } else if (b.y + b.dy > BOARD_HEIGHT - BALL_RADIUS) {
        // Paddle collision
        if(b.x > paddleX.current && b.x < paddleX.current + PADDLE_WIDTH){
             b.dy = -b.dy;
        } else {
            // Ball missed paddle
            setLives(prev => prev - 1);
            if(lives - 1 <= 0) {
                 setGameState('gameover');
            } else {
                 ball.current = {
                    x: BOARD_WIDTH / 2,
                    y: PADDLE_Y - BALL_RADIUS,
                    dx: 4,
                    dy: -4
                };
                paddleX.current = (BOARD_WIDTH - PADDLE_WIDTH) / 2;
            }
        }
    }
    
    // Brick collision
    let allBricksBroken = true;
    bricks.current.forEach(brick => {
        if(brick.status === 1){
            allBricksBroken = false;
            if(b.x > brick.x && b.x < brick.x + brick.width && b.y > brick.y && b.y < brick.y + brick.height){
                b.dy = -b.dy;
                brick.status = 0;
                setScore(prev => prev + 10);
            }
        }
    });
    
    if(allBricksBroken){
        setGameState('win');
    }

    draw();
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState, draw, lives]);
  
  useEffect(() => {
    if (gameState === 'playing') {
       animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed.current = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed.current = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed.current = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    resetGame();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
       if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [resetGame]);

  return (
    <Card className="mt-8 mx-auto max-w-md w-full">
      <CardHeader className="flex-row justify-between items-center text-center">
        <CardTitle className="w-1/2">Score: {score}</CardTitle>
        <CardTitle className="w-1/2 text-destructive">Lives: {lives}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[480/600] bg-black border-4 border-primary rounded-md overflow-hidden">
           <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
            {(gameState === 'gameover' || gameState === 'win') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
                    <p className="text-4xl font-bold">{gameState === 'win' ? 'You Win!' : 'Game Over'}</p>
                    <p>Final Score: {score}</p>
                     <Button onClick={resetGame} className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart Game
        </Button>
      </CardFooter>
    </Card>
  );
}
