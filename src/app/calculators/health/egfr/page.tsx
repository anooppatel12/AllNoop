
import { EgfrCalculator } from '@/components/health/egfr-calculator';

export default function EgfrCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Kidney Function (eGFR) Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Estimate your Glomerular Filtration Rate (eGFR) using the CKD-EPI 2021 equation.
        </p>
      </div>

      <EgfrCalculator />
    </div>
  );
}
