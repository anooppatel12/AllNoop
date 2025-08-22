
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game constants
const BOARD_WIDTH = 480;
const BOARD_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_Y_OFFSET = 30;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 30;
const INITIAL_LIVES = 3;

// Type definitions
type GameState = 'waiting' | 'playing' | 'gameover' | 'win';

type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status: 'active' | 'broken';
};

const brickColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function BrickBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  
  // Refs for game objects to manage their state across renders without causing re-renders
  const paddleX = useRef(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const ball = useRef({
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT - PADDLE_Y_OFFSET - BALL_RADIUS,
    dx: 4,
    dy: -4,
  });
  const bricks = useRef<Brick[]>([]);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number>();

  /**
   * Creates the grid of bricks for the current level.
   */
  const createBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        newBricks.push({
          x: c * (BRICK_WIDTH + BRICK_GAP) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: brickColors[r % brickColors.length],
          status: 'active',
        });
      }
    }
    bricks.current = newBricks;
  }, []);

  /**
   * Resets the ball and paddle to their starting positions.
   * Adjusts ball speed based on the level.
   */
  const resetBallAndPaddle = useCallback(() => {
    const speedMultiplier = Math.pow(1.1, level - 1);
     ball.current = {
        x: BOARD_WIDTH / 2,
        y: BOARD_HEIGHT - PADDLE_Y_OFFSET - PADDLE_HEIGHT - BALL_RADIUS,
        dx: (Math.random() > 0.5 ? 4 : -4) * speedMultiplier,
        dy: -4 * speedMultiplier,
    };
    paddleX.current = (BOARD_WIDTH - PADDLE_WIDTH) / 2;
  }, [level]);
  
  /**
   * Resets the entire game to its initial state for a new game.
   */
  const resetGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setLevel(1);
    createBricks();
    resetBallAndPaddle();
    setGameState('waiting');
  }, [createBricks, resetBallAndPaddle]);

  /**
   * Advances the game to the next level.
   */
  const nextLevel = useCallback(() => {
      setLevel(prev => prev + 1);
      createBricks();
      resetBallAndPaddle();
      setGameState('waiting');
  }, [createBricks, resetBallAndPaddle]);

  /**
   * The main drawing function that renders all game elements onto the canvas.
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with a background color
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw Paddle
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.shadowColor = 'hsl(var(--primary) / 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddleX.current, BOARD_HEIGHT - PADDLE_Y_OFFSET, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.fill();
    ctx.closePath();
    
    // Draw Bricks
    bricks.current.forEach(brick => {
      if (brick.status === 'active') {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

  }, []);

  /**
   * The main game loop that updates game logic and calls the draw function.
   */
  const update = useCallback(() => {
    // Always draw the current state
    draw();

    // Only run game logic if the game is in 'playing' state
    if (gameState === 'playing') {
      // Paddle movement
      if (keysPressed.current['ArrowRight']) {
        paddleX.current = Math.min(paddleX.current + 7, BOARD_WIDTH - PADDLE_WIDTH);
      } else if (keysPressed.current['ArrowLeft']) {
        paddleX.current = Math.max(paddleX.current - 7, 0);
      }
      
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
      } 
      
      // Paddle collision
      if (
        b.y > BOARD_HEIGHT - PADDLE_Y_OFFSET - PADDLE_HEIGHT - BALL_RADIUS &&
        b.y < BOARD_HEIGHT - PADDLE_Y_OFFSET &&
        b.x > paddleX.current &&
        b.x < paddleX.current + PADDLE_WIDTH
      ) {
        b.dy = -b.dy;
      }

      // Bottom wall collision (lose life)
      if (b.y + BALL_RADIUS > BOARD_HEIGHT) {
          setLives(prevLives => {
              const newLives = prevLives - 1;
              if (newLives <= 0) {
                setGameState('gameover');
              } else {
                setGameState('waiting');
                resetBallAndPaddle();
              }
              return newLives;
          });
      }
      
      // Brick collision
      bricks.current.forEach(brick => {
          if (brick.status === 'active') {
              if (b.x > brick.x && b.x < brick.x + brick.width && b.y > brick.y && b.y < brick.y + brick.height) {
                  b.dy = -b.dy;
                  brick.status = 'broken';
                  setScore(prev => prev + 10);
              }
          }
      });
      
      // Check for win condition (all bricks broken)
      if (bricks.current.every(brick => brick.status === 'broken')) {
          nextLevel();
      }
    }

    animationFrameId.current = requestAnimationFrame(update);
  }, [gameState, draw, resetBallAndPaddle, nextLevel]);

  /**
   * Sets up event listeners and initializes the game.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') keysPressed.current['ArrowRight'] = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft') keysPressed.current['ArrowLeft'] = true;
      if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (gameState === 'waiting' || gameState === 'gameover' || gameState === 'win') {
            handleStartButtonClick();
          }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') keysPressed.current['ArrowRight'] = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft') keysPressed.current['ArrowLeft'] = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const relativeX = e.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < BOARD_WIDTH) {
            paddleX.current = Math.max(0, Math.min(relativeX - PADDLE_WIDTH / 2, BOARD_WIDTH - PADDLE_WIDTH));
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const relativeX = touch.clientX - canvas.getBoundingClientRect().left;
            if (relativeX > 0 && relativeX < BOARD_WIDTH) {
                paddleX.current = Math.max(0, Math.min(relativeX - PADDLE_WIDTH / 2, BOARD_WIDTH - PADDLE_WIDTH));
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('touchmove', handleTouchMove);
    
    resetGame();
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('touchmove', handleTouchMove);
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartButtonClick = () => {
    if (gameState === 'waiting') {
        setGameState('playing');
    } else if (gameState === 'gameover' || gameState === 'win') {
        resetGame();
    }
  }

  const GameOverlay = ({ title, buttonText }: { title: string, buttonText: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10 p-4 text-center">
       <h2 className="text-4xl font-bold">{title}</h2>
       {gameState === 'gameover' && <p className="text-lg mt-2">Final Score: {score}</p>}
       <Button onClick={handleStartButtonClick} className="mt-6 text-lg px-6 py-4">
            <RefreshCw className="mr-2 h-5 w-5" />
            {buttonText}
        </Button>
    </div>
  );

  return (
    <Card className="mt-8 mx-auto max-w-lg w-full">
      <CardHeader className="flex-row justify-between items-center text-center">
        <CardTitle className="w-1/3 text-lg">Score: {score}</CardTitle>
        <CardTitle className="w-1/3 text-lg">Level: {level}</CardTitle>
        <div className="w-1/3 flex justify-end items-center gap-2">
            <Heart className="h-6 w-6 text-destructive" />
            <span className="text-lg font-bold">{lives}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[480/600] bg-secondary border-4 border-primary rounded-md overflow-hidden cursor-none">
           <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
            {gameState === 'win' && <GameOverlay title="You Win!" buttonText="Play Again" />}
            {gameState === 'gameover' && <GameOverlay title="Game Over" buttonText="Restart Game" />}
            {gameState === 'waiting' && <GameOverlay title={`Level ${level}`} buttonText="Start Game" />}
        </div>
      </CardContent>
       <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
            Use arrow keys or mouse/touch to move the paddle.
        </p>
      </CardFooter>
    </Card>
  );
}
