
import { LeanBodyMassCalculator } from '@/components/lean-body-mass-calculator';

export default function LeanBodyMassCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Lean Body Mass Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your lean body mass using the Boer formula.
        </p>
      </div>

      <LeanBodyMassCalculator />
    </div>
  );
}
