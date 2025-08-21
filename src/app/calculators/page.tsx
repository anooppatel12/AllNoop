
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, BrainCircuit, FlaskConical, Atom, PiggyBank, Percent, Calculator, Sigma, Users, SquareRoot, Bot, FunctionSquare } from 'lucide-react';

const calculatorCategories = [
  {
    name: 'Health & Fitness',
    icon: HeartPulse,
    calculators: [
      { name: 'BMI Calculator', href: '/calculators/bmi', description: 'Calculate your Body Mass Index' },
      { name: 'BMR Calculator', href: '/calculators/bmr', description: 'Calculate your Basal Metabolic Rate' },
      { name: 'Calorie Calculator', href: '/calculators/calorie', description: 'Estimate your daily calorie needs' },
    ],
  },
  {
    name: 'Financial',
    icon: PiggyBank,
    calculators: [
      { name: 'EMI Calculator', href: '/calculators/financial/emi', description: 'Calculate your Equated Monthly Instalment' },
      { name: 'Interest Calculator', href: '/calculators/financial/interest', description: 'Calculate simple and compound interest' },
      { name: 'Discount Calculator', href: '/calculators/financial/discount', description: 'Calculate the final price after a discount' },
    ],
  },
  {
    name: 'Math & Academic',
    icon: Sigma,
    calculators: [
      { name: 'Basic Calculator', href: '/calculators/math/basic', description: 'Perform basic arithmetic operations' },
      { name: 'Percentage Calculator', href: '/calculators/math/percentage', description: 'Calculate percentages with ease' },
      { name: 'Age Calculator', href: '/calculators/math/age', description: 'Calculate age from date of birth' },
      { name: 'Date Calculator', href: '/calculators/math/date', description: 'Calculate the difference between dates' },
      { name: 'Square & Square Root Calculator', href: '/calculators/math/square-root', description: 'Calculate square and square root of a number' },
      { name: 'Cube & Cube Root Calculator', href: '/calculators/math/cube-root', description: 'Calculate cube and cube root of a number' },
      { name: 'Pythagorean Theorem Calculator', href: '/calculators/math/pythagorean', description: 'Calculate the missing side of a right-angled triangle' },
      { name: 'Trigonometric Calculator', href: '/calculators/math/trigonometry', description: 'Calculate trig values for an angle' },
      { name: 'Geometry Calculator', href: '/calculators/math/geometry', description: 'Calculate area, perimeter, etc. for shapes' },
    ],
  },
  {
    name: 'Other Useful Calculators',
    icon: Atom,
    calculators: [
        { name: 'Tip Calculator', href: '/calculators/other/tip', description: 'Calculate the tip for a bill' },
    ],
  }
];

export default function CalculatorsPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Calculators
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          A collection of useful calculators to help you with your daily needs.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {calculatorCategories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center gap-4">
              <category.icon className="h-8 w-8 text-primary" />
              <h2 className="font-headline text-2xl font-bold">{category.name}</h2>
            </div>
            {category.calculators.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.calculators.map((calculator) => (
                  <Link href={calculator.href} key={calculator.name} className="group">
                    <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                      <CardHeader>
                        <CardTitle>{calculator.name}</CardTitle>
                        <CardDescription>{calculator.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">More calculators coming soon!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
