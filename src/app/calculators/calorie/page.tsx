
import { CalorieCalculator } from '@/components/calorie-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalorieCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Daily Calorie Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Estimate the number of calories you need each day to maintain, lose, or gain weight based on your activity level.
        </p>
      </div>

      <CalorieCalculator />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Your Calorie Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Calories are units of energy that your body uses to perform all its functions, from breathing to exercising. The number of calories you need depends on various factors, including your age, gender, height, weight, and level of physical activity. This calculator helps you estimate your Total Daily Energy Expenditure (TDEE), which is the total number of calories you burn in a day.
          </p>
          <h3 className="font-semibold text-foreground">How Can This Calculator Help You?</h3>
          <p>
            By understanding your daily calorie needs, you can make informed decisions about your diet to achieve your health and fitness goals. 
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Weight Maintenance:</strong> Consume roughly the same number of calories as your TDEE.</li>
            <li><strong>Weight Loss:</strong> Consume fewer calories than your TDEE (a caloric deficit).</li>
            <li><strong>Weight Gain:</strong> Consume more calories than your TDEE (a caloric surplus).</li>
          </ul>
           <h3 className="font-semibold text-foreground">How to Use This Tool</h3>
           <p>
            First, enter your personal details like age, gender, height, and weight. Then, select the activity level that most accurately describes your typical week. The calculator will use this information with the Mifflin-St Jeor equation to estimate the number of calories you need per day to maintain your current weight.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
