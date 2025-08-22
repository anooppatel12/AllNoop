
import { PongGame } from '@/components/games/pong';

export default function PongPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Pong
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          The classic paddle game. Player 1 uses 'W' and 'S' keys. Player 2 uses the Up and Down arrow keys.
        </p>
      </div>

      <PongGame />
    </div>
  );
}
