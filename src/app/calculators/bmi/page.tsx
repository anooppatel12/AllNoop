
import { BmiCalculator } from '@/components/bmi-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BmiCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Body Mass Index (BMI) Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your Body Mass Index to get a general indication of your body fat and overall health category.
        </p>
      </div>

      <BmiCalculator />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding the BMI Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The Body Mass Index (BMI) is a widely used metric that estimates your body fat based on your height and weight. It provides a simple, accessible way to gauge whether you are underweight, at a healthy weight, overweight, or obese. While it doesn't measure body fat directly, it correlates with more direct measures and is a reliable indicator for most people.
          </p>
          <h3 className="font-semibold text-foreground">Why is BMI Important?</h3>
          <p>
            Your BMI can be an important screening tool for potential health issues. A high BMI is often associated with an increased risk of certain diseases such as heart disease, high blood pressure, type 2 diabetes, and some cancers. Conversely, a very low BMI can indicate malnutrition or other health problems.
          </p>
           <h3 className="font-semibold text-foreground">How to Use the Calculator</h3>
           <p>
            Simply select your preferred unit of measurement (Metric or Imperial), enter your height and weight, and click "Calculate BMI". The tool will display your BMI score and the corresponding weight category. Use this information as a starting point for a conversation with a healthcare provider about your health and wellness goals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
