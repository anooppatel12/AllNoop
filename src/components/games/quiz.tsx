
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';

type Question = {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type GameState = 'setup' | 'playing' | 'finished';

const decodeHtml = (html: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export function QuizGame() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Setup state
  const [amount, setAmount] = useState('10');
  const [difficulty, setDifficulty] = useState('medium');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`);
      if (!response.ok) throw new Error('Failed to fetch questions.');
      const data = await response.json();
      if (data.response_code !== 0) throw new Error('Could not retrieve questions for the selected criteria. Please try different options.');
      
      const decodedQuestions = data.results.map((q: Question) => ({
        ...q,
        question: decodeHtml(q.question),
        correct_answer: decodeHtml(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtml)
      }));

      setQuestions(decodedQuestions);
      setGameState('playing');
    } catch (e: any) {
      setError(e.message);
      setGameState('setup');
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    fetchQuestions();
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('finished');
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const answerOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  if (gameState === 'setup' || gameState === 'finished') {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{gameState === 'setup' ? 'Quiz Setup' : 'Quiz Finished!'}</CardTitle>
          <CardDescription>
            {gameState === 'setup' ? 'Choose your quiz settings.' : `You scored ${score} out of ${questions.length}!`}
          </CardDescription>
        </CardHeader>
        {gameState === 'finished' && (
             <CardContent className="text-center">
                <p className="text-5xl font-bold text-primary">
                    {((score / questions.length) * 100).toFixed(0)}%
                </p>
            </CardContent>
        )}
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={amount} onValueChange={setAmount}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
              </div>
          </div>
          {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        </CardContent>
        <CardFooter>
          <Button onClick={startQuiz} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            {gameState === 'setup' ? 'Start Quiz' : 'Play Again'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
     <Card className="mt-8">
        <CardHeader>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-2"/>
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <CardDescription>{currentQuestion.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} disabled={isAnswered}>
              {answerOptions.map((answer, index) => {
                  const isCorrect = answer === currentQuestion.correct_answer;
                  const isSelected = answer === selectedAnswer;
                  return (
                      <div key={index} 
                          className={cn("flex items-center space-x-2 rounded-md border p-4",
                           isAnswered && isCorrect && "border-green-500 bg-green-500/10",
                           isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
                          )}
                      >
                        <RadioGroupItem value={answer} id={`q-${index}`} />
                        <Label htmlFor={`q-${index}`} className="flex-1 cursor-pointer">{answer}</Label>
                      </div>
                  );
              })}
            </RadioGroup>
        </CardContent>
        <CardFooter>
            {isAnswered ? (
                <Button onClick={handleNextQuestion} className="w-full">
                   {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
            ) : (
                 <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} className="w-full">
                    Submit Answer
                </Button>
            )}
        </CardFooter>
     </Card>
  )
}
