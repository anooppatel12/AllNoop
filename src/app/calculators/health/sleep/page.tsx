
import { SleepCalculator } from '@/components/health/sleep-calculator';

export default function SleepCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Sleep Cycle Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Find the best time to wake up or go to sleep based on your sleep cycles.
        </p>
      </div>

      <SleepCalculator />
    </div>
  );
}
