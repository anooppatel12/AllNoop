
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, BrainCircuit, FlaskConical, Atom } from 'lucide-react';

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
    icon: BrainCircuit,
    calculators: [],
  },
  {
    name: 'Math & Academic',
    icon: FlaskConical,
    calculators: [],
  },
  {
    name: 'Other Useful Calculators',
    icon: Atom,
    calculators: [],
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
