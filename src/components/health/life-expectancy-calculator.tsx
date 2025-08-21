
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


const lifestyleFactors = {
  smoking: {
    label: "Smoking",
    options: { "Never": 0, "Former": -2, "Current": -5, "Heavy": -10 }
  },
  alcohol: {
    label: "Alcohol Consumption",
    options: { "None/Rare": 1, "Moderate (1-2 drinks/day)": 0, "Heavy (3+ drinks/day)": -3 }
  },
  exercise: {
    label: "Physical Activity",
    options: { "Regularly (3+ times/week)": 5, "Occasionally": 2, "Sedentary": 0 }
  },
  diet: {
    label: "Diet Quality",
    options: { "Healthy (balanced, fruits/veg)": 4, "Average": 0, "Unhealthy (processed foods)": -3 }
  }
};

type Answers = { [key in keyof typeof lifestyleFactors]?: string };

export function LifeExpectancyCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (factor: keyof typeof lifestyleFactors, value: string) => {
    setAnswers(prev => ({ ...prev, [factor]: value }));
  };

  const calculateLifeExpectancy = () => {
    setError(null);
    const currentAge = parseInt(age);

    if (isNaN(currentAge) || currentAge < 18) {
      setError("Please enter a valid age (18 or older).");
      setResult(null);
      return;
    }

    if (Object.keys(answers).length !== Object.keys(lifestyleFactors).length) {
      setError("Please answer all lifestyle questions.");
      setResult(null);
      return;
    }

    // Base life expectancy (simplified global average)
    let baseLifeExpectancy = gender === 'male' ? 76 : 81;

    // Adjustments for lifestyle
    let adjustments = 0;
    for (const key in answers) {
      const factorKey = key as keyof typeof lifestyleFactors;
      const answer = answers[factorKey];
      if (answer) {
        adjustments += lifestyleFactors[factorKey].options[answer as keyof typeof lifestyleFactors[typeof factorKey]['options']];
      }
    }
    
    const finalLifeExpectancy = baseLifeExpectancy + adjustments;

    // The result should not be less than the current age.
    if (finalLifeExpectancy < currentAge) {
      setResult(currentAge + 1); // Give at least one more year
    } else {
      setResult(finalLifeExpectancy);
    }
  };

  const resetCalculator = () => {
    setAge('');
    setGender('male');
    setAnswers({});
    setResult(null);
    setError(null);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Life Expectancy Estimator</CardTitle>
        <CardDescription>Fill out the form to get a rough estimate of your life expectancy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Current Age</Label>
            <Input id="age" type="number" placeholder="Enter your age in years" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Biological Sex</Label>
            <Select onValueChange={(value: 'male' | 'female') => setGender(value)} defaultValue={gender}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
            <Label className="text-base font-medium">Lifestyle Factors</Label>
            {Object.entries(lifestyleFactors).map(([key, { label, options }]) => (
                <div key={key} className="rounded-lg border p-4">
                    <Label className="font-semibold">{label}</Label>
                    <RadioGroup 
                        className="mt-3"
                        onValueChange={(val) => handleAnswerChange(key as keyof typeof lifestyleFactors, val)}
                        value={answers[key as keyof typeof lifestyleFactors]}
                    >
                      {Object.keys(options).map(option => (
                          <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${key}-${option}`} />
                              <Label htmlFor={`${key}-${option}`} className="font-normal">{option}</Label>
                          </div>
                      ))}
                    </RadioGroup>
                </div>
            ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={calculateLifeExpectancy} className="w-full">Calculate</Button>
          <Button onClick={resetCalculator} className="w-full" variant="outline">Reset</Button>
        </div>
      </CardContent>
      {error && (
        <CardFooter>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {result !== null && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <p className="text-lg">Your estimated life expectancy is:</p>
            <p className="text-5xl font-bold text-primary">{Math.round(result)} years</p>
            <p className="mt-4 text-sm">You have an estimated <span className="font-bold">{Math.round(result) - parseInt(age)}</span> years remaining.</p>
            <p className="mt-6 text-xs text-muted-foreground">
              Disclaimer: This calculator is for informational purposes only and is not a substitute for professional medical advice. The result is a simplified estimate based on statistical averages and does not account for all individual factors.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
