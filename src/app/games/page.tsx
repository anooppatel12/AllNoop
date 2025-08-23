
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gamepad2, Puzzle, BrainCircuit, Hand, HelpCircle, Flag, VenetianMask, User, Clapperboard, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';


const SnakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-snake"><path d="M9.5 12a2.5 2.5 0 0 1 0-5h0A2.5 2.5 0 0 1 12 9.5v0a2.5 2.5 0 0 1-5 0h0a2.5 2.5 0 0 1 2.5-2.5v0a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1 5 0h0a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1 0-5" /><path d="M7 17a2 2 0 1 0-4 0" /></svg>
);

const SpaceInvadersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h2v2H5V2zm4 0h2v2H9V2zm4 0h2v2h-2V2zm4 0h2v2h-2V2zM3 4h2v2H3V4zm2 2h2v2H5V6zm-2 2h2v2H3V8zm2 2h2v2H5v-2zM3 12h2v2H3v-2zm14 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2V6zm2-2h2v2h-2V4zM7 6h2v2H7V6zm8 0h2v2h-2V6zm-4 4h2v2h-2v-2zm-2-2h2v2H9V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2H9v-2zm-2-4h2v2H7V8zm8 2h2v2h-2v-2zM7 14h2v2H7v-2zm8 0h2v2h-2v-2zm-4 2h2v2h-2v-2zM9 18h6v2H9v-2z"/></svg>
);

const games = [
    {
        name: 'Rock-Paper-Scissors',
        description: 'Play a quick game against the computer.',
        icon: Hand,
        href: '/games/rock-paper-scissors',
    },
    {
        name: 'Tic-Tac-Toe',
        description: 'Play a classic game of Tic-Tac-Toe against a friend.',
        icon: Gamepad2,
        href: '/games/tic-tac-toe',
    },
    {
        name: 'Guess the Number',
        description: 'Guess the number between 1 and 100.',
        icon: HelpCircle,
        href: '/games/guess-the-number',
    },
    {
        name: 'Green Flag or Red Flag',
        description: 'Find out if your partner is a keeper with this fun quiz.',
        icon: Flag,
        href: '/games/green-flag-red-flag',
    },
    {
        name: 'Desi Nickname Generator',
        description: 'Generate a funny desi-style nickname for yourself.',
        icon: VenetianMask,
        href: '/games/desi-nickname-generator',
    },
     {
        name: 'Bollywood Personality Quiz',
        description: 'Find out which iconic Bollywood character you are!',
        icon: Clapperboard,
        href: '/games/bollywood-personality-quiz',
    },
    {
        name: 'Main Character Quiz',
        description: 'Find out if you have main character energy.',
        icon: Sparkles,
        href: '/games/main-character-quiz',
    },
    {
        name: 'Sudoku',
        description: 'Challenge your mind with a classic game of Sudoku.',
        icon: Puzzle,
        href: '/games/sudoku',
    },
    {
        name: 'Snake',
        description: 'Guide the snake to eat the food and grow longer.',
        icon: SnakeIcon,
        href: '/games/snake',
    },
    {
        name: 'Quiz Game',
        description: 'Test your knowledge with a variety of trivia questions.',
        icon: BrainCircuit,
        href: '/games/quiz',
    },
    {
        name: 'Space Invaders',
        description: 'Defend the earth from the alien invasion!',
        icon: SpaceInvadersIcon,
        href: '/games/space-invaders',
    },
    {
        name: 'Memory Card Game',
        description: 'Test your memory by finding all the matching pairs.',
        icon: BrainCircuit,
        href: '/games/memory',
    },
    {
        name: 'Pong',
        description: 'The classic two-player paddle game.',
        icon: Gamepad2,
        href: '/games/pong',
    }
];

export default function GamesPage() {
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Mini Games
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          A collection of fun and engaging games to play.
        </p>
      </div>

       <div className="mt-12">
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((tool) => (
                <Link href={tool.href} key={tool.name} className="group" onClick={() => setLoadingTool(tool.href)}>
                <Card className={cn("h-full transition-all group-hover:border-primary group-hover:shadow-lg", loadingTool === tool.href && "animate-glow")}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <tool.icon className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>{tool.name}</CardTitle>
                            <CardDescription className="mt-1">{tool.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                </Link>
            ))}
            </div>
      </div>
    </div>
  );
}
