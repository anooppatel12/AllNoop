
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


const questions = {
  age: {
    question: "How old are you?",
    options: {
      "Under 40": 0,
      "40-49": 1,
      "50-59": 2,
      "60 or over": 3,
    }
  },
  bmi: {
    question: "What is your Body Mass Index (BMI)?",
    options: {
      "Under 25": 0,
      "25-29.9": 1,
      "30 or over": 2,
    }
  },
  familyHistory: {
    question: "Do you have a parent, brother, or sister with diabetes?",
    options: {
      "No": 0,
      "Yes": 1,
    }
  },
   highBloodPressure: {
    question: "Have you ever been told you have high blood pressure?",
    options: {
      "No": 0,
      "Yes": 1,
    }
  },
  physicalActivity: {
    question: "Are you physically active for at least 30 minutes, most days of the week?",
     options: {
      "Yes": 0,
      "No": 1,
    }
  },
  diet: {
    question: "Do you eat fruits and vegetables every day?",
     options: {
      "Yes": 0,
      "No": 1,
    }
  }
};

type Answers = {
  [key in keyof typeof questions]?: string
}

export function DiabetesRiskCalculator() {
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionKey: keyof typeof questions, value: string) => {
    setAnswers(prev => ({...prev, [questionKey]: value}));
  }

  const calculateScore = () => {
      setError(null);
      if(Object.keys(answers).length !== Object.keys(questions).length) {
          setError("Please answer all questions before calculating your risk.");
          setScore(null);
          setRiskLevel(null);
          return;
      }
      
      let totalScore = 0;
      for (const key in answers) {
          const questionKey = key as keyof typeof questions;
          const answer = answers[questionKey];
          if(answer) {
             totalScore += questions[questionKey].options[answer as keyof typeof questions[typeof questionKey]['options']];
          }
      }
      
      setScore(totalScore);

      if (totalScore <= 2) {
          setRiskLevel("Low Risk");
      } else if (totalScore <= 5) {
          setRiskLevel("Increased Risk");
      } else {
          setRiskLevel("High Risk");
      }
  }

  const resetCalculator = () => {
    setAnswers({});
    setScore(null);
    setRiskLevel(null);
    setError(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Risk Assessment Questionnaire</CardTitle>
        <CardDescription>Answer each question to the best of your ability.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Accordion type="multiple" className="w-full" defaultValue={['age']}>
            {Object.entries(questions).map(([key, { question, options }]) => (
                <AccordionItem value={key} key={key}>
                    <AccordionTrigger className="text-lg">{question}</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup 
                            className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2"
                            onValueChange={(val) => handleAnswerChange(key as keyof typeof questions, val)}
                            value={answers[key as keyof typeof questions]}
                        >
                          {Object.keys(options).map(option => (
                              <div key={option} className="flex items-center space-x-2 rounded-md border p-4 has-[:checked]:border-primary">
                                  <RadioGroupItem value={option} id={`${key}-${option}`} />
                                  <Label htmlFor={`${key}-${option}`} className="flex-1 cursor-pointer">{option}</Label>
                              </div>
                          ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        
        <div className="flex gap-4 pt-4">
          <Button onClick={calculateScore} className="w-full">Calculate Risk</Button>
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
      {score !== null && riskLevel !== null && (
        <CardFooter>
            <div className="w-full rounded-lg bg-muted p-4 text-center">
                <p className="text-lg">Your total score is:</p>
                <p className="text-4xl font-bold">{score}</p>
                <p className="mt-4 text-xl font-semibold">Your estimated risk level is:</p>
                <p className="mt-2 text-3xl font-bold text-primary">{riskLevel}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                    Disclaimer: This calculator provides an estimate of your risk and is not a substitute for a medical diagnosis. Please consult a healthcare professional for an accurate assessment of your health.
                </p>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
