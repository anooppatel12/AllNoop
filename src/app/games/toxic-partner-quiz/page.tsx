
import { ToxicPartnerQuiz } from '@/components/games/toxic-partner-quiz';

export default function ToxicPartnerQuizPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Toxic Partner Check – Fun Quiz 😅💔
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Apne partner ke bare me sach jaan’na chahte ho? 👀 This quiz will reveal the truth!
        </p>
      </div>

      <ToxicPartnerQuiz />
    </div>
  );
}
