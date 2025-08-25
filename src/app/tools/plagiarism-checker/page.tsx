
import { PlagiarismChecker } from '@/components/tools/plagiarism-checker';

export default function PlagiarismCheckerPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          AI Plagiarism Checker
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Paste your text below to check for potential plagiarism against online sources.
        </p>
      </div>

      <PlagiarismChecker />
    </div>
  );
}
