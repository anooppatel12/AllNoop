
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { Progress } from '../ui/progress';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number | null;
};

type GameState = 'creating' | 'taking' | 'finished';

export function QuizCreator() {
  const [gameState, setGameState] = useState<GameState>('creating');
  const [title, setTitle] = useState('My Awesome Quiz');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswerIndex: 2 },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  
  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, text: '', options: ['', '', '', ''], correctAnswerIndex: null }]);
  };
  
  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, text } : q)));
  };

  const handleOptionChange = (qId: number, oIndex: number, text: string) => {
    setQuestions(questions.map(q => 
        q.id === qId ? {...q, options: q.options.map((opt, i) => i === oIndex ? text : opt)} : q
    ));
  };
  
  const handleCorrectAnswerChange = (qId: number, oIndex: number) => {
    setQuestions(questions.map(q => (q.id === qId ? { ...q, correctAnswerIndex: oIndex } : q)));
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameState('taking');
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswerIndex) {
        setScore(prev => prev + 1);
    }
    
    setSelectedAnswer(null);

    if(currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        setGameState('finished');
    }
  };
  
  const restartQuiz = () => {
      setGameState('creating');
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
  }

  if (gameState === 'taking') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <Card className="mt-8">
        <CardHeader>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-2" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold">{currentQuestion.text}</p>
          <RadioGroup value={String(selectedAnswer)} onValueChange={(val) => setSelectedAnswer(Number(val))}>
            {currentQuestion.options.map((option, index) => (
              option && (
                <div key={index} className="flex items-center space-x-2 rounded-md border p-4 has-[:checked]:border-primary">
                  <RadioGroupItem value={String(index)} id={`q-${currentQuestion.id}-o-${index}`} />
                  <Label htmlFor={`q-${currentQuestion.id}-o-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              )
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="w-full">
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (gameState === 'finished') {
    return (
      <Card className="mt-8">
          <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>Here's how you did on "{title}".</CardDescription>
          </CardHeader>
           <CardContent className="text-center">
                <p className="text-lg">Your Score:</p>
                <p className="text-6xl font-bold text-primary">
                    {score} / {questions.length}
                </p>
                <p className="text-3xl font-bold mt-2">
                    {((score / questions.length) * 100).toFixed(0)}%
                </p>
            </CardContent>
            <CardFooter>
                 <Button onClick={restartQuiz} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Create or Take Another Quiz
                </Button>
            </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Create Your Quiz</CardTitle>
        <CardDescription>Add a title and your questions below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="quiz-title">Quiz Title</Label>
          <Input id="quiz-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        {questions.map((q, qIndex) => (
          <div key={q.id} className="space-y-4 rounded-lg border p-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Question {qIndex + 1}</Label>
              <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} disabled={questions.length <= 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Input
              placeholder="Enter your question"
              value={q.text}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            />
            <div className="space-y-2">
                <Label>Answer Options (Select the correct one)</Label>
                <RadioGroup onValueChange={(val) => handleCorrectAnswerChange(q.id, Number(val))}>
                    {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                            <RadioGroupItem value={String(oIndex)} id={`q-${q.id}-o-${oIndex}`} checked={q.correctAnswerIndex === oIndex}/>
                             <Input
                                id={`q-${q.id}-o-${oIndex}`}
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                            />
                        </div>
                    ))}
                </RadioGroup>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={startQuiz} className="w-full">
            Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
