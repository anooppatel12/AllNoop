
import { ProteinIntakeCalculator } from '@/components/nutrition/protein-intake-calculator';

export default function ProteinIntakeCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Protein Intake Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your recommended daily protein intake based on your body weight and activity level.
        </p>
      </div>

      <ProteinIntakeCalculator />
    </div>
  );
}
