
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gamepad2, Puzzle } from 'lucide-react';

const SnakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-snake"><path d="M9.5 12a2.5 2.5 0 0 1 0-5h0A2.5 2.5 0 0 1 12 9.5v0a2.5 2.5 0 0 1-5 0h0a2.5 2.5 0 0 1 2.5-2.5v0a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1 5 0h0a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1 0-5" /><path d="M7 17a2 2 0 1 0-4 0" /></svg>
);

const games = [
    {
        name: 'Tic-Tac-Toe',
        description: 'Play a classic game of Tic-Tac-Toe against a friend.',
        icon: Gamepad2,
        href: '/games/tic-tac-toe',
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
    }
];

export default function GamesPage() {
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
                <Link href={tool.href} key={tool.name} className="group">
                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
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
