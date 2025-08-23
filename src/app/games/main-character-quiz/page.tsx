
import { MainCharacterQuiz } from '@/components/games/main-character-quiz';

export default function MainCharacterQuizPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Are You a Main Character?
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Answer a few questions to find out if you have main character energy!
        </p>
      </div>

      <MainCharacterQuiz />
    </div>
  );
}
