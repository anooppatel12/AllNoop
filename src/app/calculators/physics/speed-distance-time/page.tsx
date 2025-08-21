
import { SpeedDistanceTimeCalculator } from '@/components/physics/speed-distance-time-calculator';

export default function SpeedDistanceTimeCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Speed, Distance, Time Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate speed, distance, or time given the other two values.
        </p>
      </div>

      <SpeedDistanceTimeCalculator />
    </div>
  );
}
