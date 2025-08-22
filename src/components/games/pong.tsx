
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 6;
const BALL_SIZE = 10;
const WINNING_SCORE = 11;

type GameState = 'waiting' | 'playing' | 'gameover';
type Score = { player1: number; player2: number };

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [score, setScore] = useState<Score>({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  const paddle1Y = useRef(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const paddle2Y = useRef(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const ball = useRef({
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT / 2,
    dx: 5,
    dy: 5,
  });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number>();

  const resetBall = (direction: 1 | -1) => {
    ball.current = {
        x: BOARD_WIDTH / 2,
        y: BOARD_HEIGHT / 2,
        dx: 5 * direction,
        dy: Math.random() > 0.5 ? 5 : -5,
    };
  };

  const resetGame = useCallback(() => {
    setScore({ player1: 0, player2: 0 });
    setWinner(null);
    paddle1Y.current = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    paddle2Y.current = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    resetBall(Math.random() > 0.5 ? 1 : -1);
  }, []);
  
  const startGame = () => {
    if(gameState !== 'playing') {
       resetGame();
       setGameState('playing');
    }
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
    };

    // Paddle movement
    if (keysPressed.current['w'] && paddle1Y.current > 0) {
      paddle1Y.current -= PADDLE_SPEED;
    }
    if (keysPressed.current['s'] && paddle1Y.current < BOARD_HEIGHT - PADDLE_HEIGHT) {
      paddle1Y.current += PADDLE_SPEED;
    }
    if (keysPressed.current['ArrowUp'] && paddle2Y.current > 0) {
      paddle2Y.current -= PADDLE_SPEED;
    }
    if (keysPressed.current['ArrowDown'] && paddle2Y.current < BOARD_HEIGHT - PADDLE_HEIGHT) {
      paddle2Y.current += PADDLE_SPEED;
    }
    
    // Ball movement
    const b = ball.current;
    b.x += b.dx;
    b.y += b.dy;

    // Wall collision (top/bottom)
    if (b.y + b.dy > BOARD_HEIGHT - BALL_SIZE || b.y + b.dy < BALL_SIZE) {
      b.dy = -b.dy;
    }

    // Paddle collision
    // Player 1
    if (b.dx < 0 && b.x - BALL_SIZE < 10 + PADDLE_WIDTH && b.x > 10 && b.y > paddle1Y.current && b.y < paddle1Y.current + PADDLE_HEIGHT) {
        b.dx = -b.dx;
    }
    // Player 2
    if (b.dx > 0 && b.x + BALL_SIZE > BOARD_WIDTH - 10 - PADDLE_WIDTH && b.x < BOARD_WIDTH - 10 && b.y > paddle2Y.current && b.y < paddle2Y.current + PADDLE_HEIGHT) {
        b.dx = -b.dx;
    }

    // Score
    if (b.x < 0) { // Player 2 scores
      setScore(s => {
          const newScore = s.player2 + 1;
          if (newScore >= WINNING_SCORE) {
              setWinner('Player 2');
              setGameState('gameover');
          }
          return {...s, player2: newScore};
      });
      resetBall(-1);
    }
    if (b.x > BOARD_WIDTH) { // Player 1 scores
      setScore(s => {
        const newScore = s.player1 + 1;
        if (newScore >= WINNING_SCORE) {
            setWinner('Player 1');
            setGameState('gameover');
        }
        return {...s, player1: newScore};
      });
      resetBall(1);
    }
    
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear board to black
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw paddles
    ctx.fillStyle = '#FFF';
    ctx.fillRect(10, paddle1Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(BOARD_WIDTH - PADDLE_WIDTH - 10, paddle2Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.closePath();
    
    // Draw net
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(BOARD_WIDTH / 2, 0);
    ctx.lineTo(BOARD_WIDTH / 2, BOARD_HEIGHT);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  useEffect(() => {
    const render = () => {
      draw();
      animationFrameId.current = requestAnimationFrame(render);
    }
    const id = requestAnimationFrame(render);
    return () => {
        if(animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, [draw]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current[e.key] = false;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    resetGame();
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [resetGame, gameLoop]);


  return (
    <Card className="mt-8 mx-auto max-w-2xl w-full">
      <CardHeader className="flex-row justify-between items-center text-center">
        <CardTitle className="w-1/2">Player 1: {score.player1}</CardTitle>
        <CardTitle className="w-1/2">Player 2: {score.player2}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[600/400] bg-black border-4 border-primary rounded-md overflow-hidden">
           <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
            {(gameState === 'gameover' || gameState === 'waiting') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10 p-4 text-center">
                   {gameState === 'gameover' && winner && <h2 className="text-4xl font-bold">{winner} Wins!</h2>}
                   {gameState === 'waiting' && <h2 className="text-2xl font-bold">Press Start to Play</h2>}
                     <Button onClick={startGame} className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {gameState === 'gameover' ? 'Play Again' : 'Start Game'}
                    </Button>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-muted-foreground">
        <p><span className="font-bold">Player 1 Controls:</span> W (up), S (down)</p>
        <p><span className="font-bold">Player 2 Controls:</span> Arrow Up, Arrow Down</p>
      </CardFooter>
    </Card>
  );
}
