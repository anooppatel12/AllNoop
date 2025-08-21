
import { EmiCalculator } from '@/components/financial/emi-calculator';

export default function EmiCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          EMI Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your Equated Monthly Instalment (EMI) for loans.
        </p>
      </div>

      <EmiCalculator />
    </div>
  );
}
