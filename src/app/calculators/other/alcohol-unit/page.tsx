
import { AlcoholUnitCalculator } from '@/components/other/alcohol-unit-calculator';

export default function AlcoholUnitCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Alcohol Unit Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate the number of alcohol units in a drink.
        </p>
      </div>

      <AlcoholUnitCalculator />
    </div>
  );
}
