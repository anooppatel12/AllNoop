
import { RockPaperScissorsGame } from '@/components/games/rock-paper-scissors';

export default function RockPaperScissorsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Rock Paper Scissors
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Choose your weapon and challenge the computer!
        </p>
      </div>

      <RockPaperScissorsGame />
    </div>
  );
}
