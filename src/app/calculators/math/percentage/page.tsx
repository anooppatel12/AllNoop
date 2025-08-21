
import { PercentageCalculator } from '@/components/math/percentage-calculator';

export default function PercentageCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Percentage Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate percentages with ease.
        </p>
      </div>

      <PercentageCalculator />
    </div>
  );
}
