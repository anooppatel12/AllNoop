
import { BasicCalculator } from '@/components/math/basic-calculator';

export default function BasicCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Basic Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Perform basic arithmetic operations like addition, subtraction, multiplication, and division.
        </p>
      </div>

      <BasicCalculator />
    </div>
  );
}
