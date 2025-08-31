
import { BodyFatPercentageCalculator } from '@/components/body-fat-percentage-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BodyFatPercentageCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Body Fat Percentage Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Estimate your body fat percentage using the U.S. Navy Method, a simple and effective way to gauge body composition.
        </p>
      </div>

      <BodyFatPercentageCalculator />

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Body Fat Percentage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Body fat percentage is a measure of your fitness level, representing the proportion of your total body weight that is fat. Unlike BMI, which only considers height and weight, body fat percentage gives a clearer picture of your body composition by distinguishing between fat mass and lean mass (muscles, bones, organs).
          </p>
          <h3 className="font-semibold text-foreground">Why is it Important?</h3>
          <p>
            Monitoring your body fat percentage is essential for health and fitness. Excess body fat, particularly around the abdomen, is linked to a higher risk of health problems like heart disease, diabetes, and high blood pressure. Maintaining a healthy body fat percentage can improve your overall well-being and athletic performance.
          </p>
           <h3 className="font-semibold text-foreground">The U.S. Navy Method</h3>
           <p>
            This calculator uses the U.S. Navy Method, which relies on body circumference measurements. It's a convenient way to estimate body fat without expensive equipment. To use it, select your gender and preferred units, then enter your height, neck, and waist measurements. For females, a hip measurement is also required. The calculator will provide your estimated body fat percentage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
