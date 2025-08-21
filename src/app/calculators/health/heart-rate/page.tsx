
import { HeartRateCalculator } from '@/components/health/heart-rate-calculator';

export default function HeartRateCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Target Heart Rate Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your target heart rate zone for effective exercise.
        </p>
      </div>

      <HeartRateCalculator />
    </div>
  );
}
