
import { BmrCalculator } from '@/components/bmr-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BmrCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Basal Metabolic Rate (BMR) Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate the number of calories your body needs to function at rest.
        </p>
      </div>

      <BmrCalculator />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Your BMR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Your Basal Metabolic Rate (BMR) is the number of calories your body requires to perform its most basic, life-sustaining functions. This includes processes like breathing, circulation, cell production, and nutrient processing, all while you are at rest. It's the minimum amount of energy your body needs to stay alive.
          </p>
          <h3 className="font-semibold text-foreground">Why Calculate Your BMR?</h3>
          <p>
            Knowing your BMR is a crucial first step in weight management. By understanding your baseline caloric needs, you can more accurately determine how many calories you should consume to lose, maintain, or gain weight. When combined with your activity level, your BMR helps calculate your Total Daily Energy Expenditure (TDEE), which is the total number of calories you burn in a day.
          </p>
           <h3 className="font-semibold text-foreground">How It Works</h3>
           <p>
            This calculator uses the Mifflin-St Jeor equation, which is widely considered one of the most accurate formulas for estimating BMR. Simply input your gender, age, height, and weight to receive your BMR result in calories per day.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
