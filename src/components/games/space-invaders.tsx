
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useInterval } from '@/hooks/use-interval';

const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 400;

// Player
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 15;
const PLAYER_SPEED = 5;

// Alien
const ALIEN_ROWS = 4;
const ALIEN_COLS = 8;
const ALIEN_WIDTH = 20;
const ALIEN_HEIGHT = 15;
const ALIEN_GAP = 10;
const ALIEN_SPEED = 1;

// Projectiles
const PROJECTILE_WIDTH = 3;
const PROJECTILE_HEIGHT = 10;
const PROJECTILE_SPEED = 7;

type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function SpaceInvadersGame() {
  const [player, setPlayer] = useState<GameObject>({ x: (BOARD_WIDTH - PLAYER_WIDTH) / 2, y: BOARD_HEIGHT - PLAYER_HEIGHT - 10, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
  const [aliens, setAliens] = useState<GameObject[]>([]);
  const [projectiles, setProjectiles] = useState<GameObject[]>([]);
  const [alienProjectiles, setAlienProjectiles] = useState<GameObject[]>([]);
  const [alienDirection, setAlienDirection] = useState<'left' | 'right'>('right');
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const gameLoopRef = useRef<number | null>(null);

  const createAliens = useCallback(() => {
    const newAliens: GameObject[] = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        newAliens.push({
          x: col * (ALIEN_WIDTH + ALIEN_GAP) + 30,
          y: row * (ALIEN_HEIGHT + ALIEN_GAP) + 30,
          width: ALIEN_WIDTH,
          height: ALIEN_HEIGHT,
        });
      }
    }
    setAliens(newAliens);
  }, []);

  const startGame = useCallback(() => {
    createAliens();
    setPlayer({ x: (BOARD_WIDTH - PLAYER_WIDTH) / 2, y: BOARD_HEIGHT - PLAYER_HEIGHT - 10, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
    setProjectiles([]);
    setAlienProjectiles([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsGameOver(false);
    setIsRunning(true);
  }, [createAliens]);
  
  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' && projectiles.length < 3) {
      e.preventDefault();
      setProjectiles(prev => [...prev, { x: player.x + PLAYER_WIDTH / 2 - PROJECTILE_WIDTH / 2, y: player.y, width: PROJECTILE_WIDTH, height: PROJECTILE_HEIGHT }]);
    } else {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    }
  }, [player, projectiles.length]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const gameLoop = useCallback(() => {
    if (!isRunning || isGameOver) return;

    // Player movement
    setPlayer(prev => {
      let newX = prev.x;
      if (keys['ArrowLeft'] && newX > 0) newX -= PLAYER_SPEED;
      if (keys['ArrowRight'] && newX < BOARD_WIDTH - PLAYER_WIDTH) newX += PLAYER_SPEED;
      return { ...prev, x: newX };
    });

    // Projectile movement
    setProjectiles(prev => prev.map(p => ({ ...p, y: p.y - PROJECTILE_SPEED })).filter(p => p.y > 0));
    setAlienProjectiles(prev => prev.map(p => ({ ...p, y: p.y + PROJECTILE_SPEED / 2 })).filter(p => p.y < BOARD_HEIGHT));

    // Alien movement and shooting
    setAliens(prevAliens => {
      let wallHit = false;
      const newAliens = prevAliens.map(alien => {
        let newX = alien.x;
        if (alienDirection === 'right') {
          newX += ALIEN_SPEED;
          if (newX > BOARD_WIDTH - ALIEN_WIDTH) wallHit = true;
        } else {
          newX -= ALIEN_SPEED;
          if (newX < 0) wallHit = true;
        }
        return { ...alien, x: newX };
      });
      
      if (wallHit) {
        setAlienDirection(prev => prev === 'right' ? 'left' : 'right');
        return newAliens.map(a => ({ ...a, y: a.y + ALIEN_HEIGHT }));
      }
      return newAliens;
    });
    
    // Alien shooting
    if (Math.random() < 0.02 * level && aliens.length > 0) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        setAlienProjectiles(prev => [...prev, { x: randomAlien.x + ALIEN_WIDTH / 2, y: randomAlien.y + ALIEN_HEIGHT, width: PROJECTILE_WIDTH, height: PROJECTILE_HEIGHT }]);
    }

    // Collision detection
    // Player projectiles hitting aliens
    setProjectiles(prevP => {
      const activeProjectiles = [];
      for (const p of prevP) {
        let hit = false;
        setAliens(prevA => {
          const remainingAliens = prevA.filter(a => {
            const collision = p.x < a.x + a.width && p.x + p.width > a.x && p.y < a.y + a.height && p.y + p.height > a.y;
            if (collision) {
              hit = true;
              setScore(s => s + 10);
              return false; // Remove alien
            }
            return true;
          });
          return remainingAliens;
        });
        if (!hit) activeProjectiles.push(p);
      }
      return activeProjectiles;
    });
    
    // Alien projectiles hitting player
    setAlienProjectiles(prevAP => {
        return prevAP.filter(p => {
             const collision = p.x < player.x + player.width && p.x + p.width > player.x && p.y < player.y + player.height && p.y + p.height > player.y;
             if(collision) {
                 setLives(l => l - 1);
                 return false;
             }
             return true;
        });
    });

    // Game over conditions
    if (lives <= 0 || aliens.some(a => a.y + a.height >= player.y)) {
        setIsGameOver(true);
        setIsRunning(false);
    }
    
    // Next level
    if (aliens.length === 0 && !isGameOver) {
        setLevel(l => l + 1);
        setLives(l => l + 1);
        createAliens();
    }
  }, [isRunning, isGameOver, keys, alienDirection, level, aliens, lives, player.y, createAliens]);

  useInterval(gameLoop, 50);

  return (
    <Card className="mt-8 mx-auto max-w-sm">
      <CardHeader className="flex-row justify-between items-center text-center">
        <CardTitle className="w-1/3">Score: {score}</CardTitle>
        <CardTitle className="w-1/3 text-destructive">Level: {level}</CardTitle>
        <CardTitle className="w-1/3">Lives: {lives}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square bg-black border-4 border-primary rounded-md overflow-hidden">
            {/* Player */}
            <div style={{ position: 'absolute', left: player.x, top: player.y, width: player.width, height: player.height, backgroundColor: 'hsl(var(--primary))' }} />

            {/* Aliens */}
            {aliens.map((alien, i) => (
                <div key={i} style={{ position: 'absolute', left: alien.x, top: alien.y, width: alien.width, height: alien.height, backgroundColor: 'hsl(var(--destructive))' }} />
            ))}
            
            {/* Projectiles */}
            {projectiles.map((p, i) => (
                 <div key={`p-${i}`} style={{ position: 'absolute', left: p.x, top: p.y, width: p.width, height: p.height, backgroundColor: 'hsl(var(--primary-foreground))' }} />
            ))}
            {alienProjectiles.map((p, i) => (
                 <div key={`ap-${i}`} style={{ position: 'absolute', left: p.x, top: p.y, width: p.width, height: p.height, backgroundColor: 'yellow' }} />
            ))}
            
            {isGameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
                    <p className="text-4xl font-bold">Game Over</p>
                    <p>Final Score: {score}</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startGame} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isGameOver ? 'Play Again' : 'Restart Game'}
        </Button>
      </CardFooter>
    </Card>
  );
}
