
import { ForceWorkEnergyPowerCalculator } from '@/components/physics/force-work-energy-power-calculator';

export default function ForceWorkEnergyPowerCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Force, Work, Energy, Power Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate force, work, energy, or power using classical mechanics formulas.
        </p>
      </div>

      <ForceWorkEnergyPowerCalculator />
    </div>
  );
}
