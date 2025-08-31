
import { GpaCalculator } from '@/components/math/gpa-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GpaCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          GPA / CGPA Calculator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Easily calculate your Grade Point Average (GPA) for a semester or your Cumulative GPA (CGPA) for your entire academic career.
        </p>
      </div>

      <GpaCalculator />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding Your GPA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Grade Point Average (GPA) is a standard way of measuring academic achievement. It converts your letter grades into a numerical scale, typically from 0.0 to 4.0. Calculating your GPA is essential for tracking your academic progress, applying for scholarships, and meeting requirements for university admissions or graduation.
          </p>
          <h3 className="font-semibold text-foreground">How to Use the GPA Calculator</h3>
          <p>
            Our calculator simplifies the process. For each course you've taken, enter the number of credits (or credit hours) and the letter grade you received. The tool uses a standard 4.0 scale (A=4.0, A-=3.7, B+=3.3, etc.) to calculate your GPA.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>For Semester GPA:</strong> Enter the courses for a single semester.</li>
            <li><strong>For CGPA:</strong> Add all courses you have completed so far.</li>
          </ul>
          <p>
            Click "Add Course" to add more rows as needed. Once all your courses are entered, click "Calculate GPA" to see your result instantly. This tool helps you stay on top of your academic performance without manual calculations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
