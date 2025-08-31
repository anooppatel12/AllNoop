
import { AgeCalculator } from '@/components/math/age-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgeCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Age Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Find your exact chronological age by simply entering your date of birth.
        </p>
      </div>

      <AgeCalculator />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>More Than Just a Number</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This Age Calculator provides a precise calculation of your age, breaking it down into years, months, and days. It's a fun and useful tool for a variety of purposes, from filling out applications to planning birthday celebrations or satisfying simple curiosity.
          </p>
          <h3 className="font-semibold text-foreground">How Does It Work?</h3>
          <p>
            The calculator determines the time difference between your date of birth and the current date. It accurately accounts for variations in the number of days in each month and handles leap years correctly to give you the most precise result. 
          </p>
          <h3 className="font-semibold text-foreground">How to Use It</h3>
          <p>
            Using the tool is straightforward. Click on the date picker, select your year, month, and day of birth, and then click the "Calculate Age" button. Your age will be displayed instantly, showing the full count of years, months, and days you've lived.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
