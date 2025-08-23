
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HeartCrack, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  text: string;
  answers: { text: string; score: number }[];
};

const questions: Question[] = [
  {
    text: "Agar aap kisi aur friend ke saath zyada time spend karte ho toh aapke partner ka reaction?",
    answers: [
      { text: "Chill karte hain, koi problem nahi 🌸", score: 0 },
      { text: "Thoda mood off ho jaata hai 😏", score: 1 },
      { text: "Gussa + drama + block kar dete hain 👑☠️", score: 2 },
    ],
  },
  {
    text: "Aap late reply karo toh partner kya karte hain?",
    answers: [
      { text: "Bas wait karte hain ❤️", score: 0 },
      { text: "Ek do baar double text 😏", score: 1 },
      { text: "Block/unfriend kar dete hain 😂", score: 2 },
    ],
  },
  {
    text: "Agar aap kisi celebrity post pe comment karte ho toh?",
    answers: [
      { text: "Bas haste hain 😅", score: 0 },
      { text: "Puchte hain 'kyu kiya?' 😏", score: 1 },
      { text: "Full interrogation mode on 👑☠️", score: 2 },
    ],
  },
    {
    text: "Aapka phone check karte hain?",
    answers: [
      { text: "Kabhi nahi, privacy important hai 🌸", score: 0 },
      { text: "Kabhi kabhi, mazak me 😏", score: 1 },
      { text: "Roz, jaise attendance ho 👑☠️", score: 2 },
    ],
  },
  {
    text: "Jab galti unki ho, toh sorry bolte hain?",
    answers: [
      { text: "Hamesha, aur maante bhi hain ❤️", score: 0 },
      { text: "Ghuma-phira ke, 'sorry but tumne...' 😏", score: 1 },
      { text: "Sorry? Woh kya hota hai? 👑☠️", score: 2 },
    ],
  },
];

export function ToxicPartnerQuiz() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('result');
    }
  };
  
  const restartGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState('start');
  };
  
  const getResult = () => {
    if (score <= 3) return { title: 'Pure Soul 🌸', advice: 'Aapka partner ekdam wholesome hai! No toxicity, only pyaar.', color: 'text-green-500' };
    if (score <= 6) return { title: 'Thoda Toxic 😏', advice: 'Halki-phulki toxicity chalti hai, but communication is key. Baat karke solve karlo!', color: 'text-yellow-500' };
    return { title: 'Toxic King/Queen 👑☠️', advice: 'Bhaago! Yeh relationship red flag ka parade hai. Aap better deserve karte ho!', color: 'text-red-500' };
  };

  const StartScreen = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
      <HeartCrack className="mx-auto h-16 w-16 text-primary animate-pulse" />
      <h2 className="text-2xl font-bold">Apne partner ke bare me sach jano!</h2>
      <p className="text-muted-foreground">Yeh quiz bataayega ki aapke partner Pure Soul 🌸, Thoda Toxic 😏, ya Toxic King/Queen 👑☠️ hain.</p>
      <Button onClick={() => setGameState('playing')} size="lg" className="text-lg">Start Quiz</Button>
    </motion.div>
  );

  const ResultScreen = () => {
    const result = getResult();
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h2 className={cn("text-4xl font-bold", result.color)}>{result.title}</h2>
            <Card className="bg-background/50">
                <CardContent className="p-6">
                    <p className="text-lg">{result.advice}</p>
                </CardContent>
            </Card>
             <div className="flex gap-4 justify-center">
                 <Button onClick={restartGame} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Play Again
                 </Button>
            </div>
        </motion.div>
    );
  };
  
  const QuestionScreen = () => {
      const question = questions[currentQuestionIndex];
      return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
            >
                <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full" />
                <h2 className="text-2xl font-semibold text-center min-h-[6rem] flex items-center justify-center">{question.text}</h2>
                <div className="grid grid-cols-1 gap-3">
                    {question.answers.map((answer, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(answer.score)}
                            variant="outline"
                            size="lg"
                            className="text-md h-auto py-3 whitespace-normal"
                        >
                            {answer.text}
                        </Button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
      )
  };

  return (
    <Card className="mt-8 mx-auto max-w-2xl overflow-hidden">
      <CardContent className="p-8 min-h-[450px] flex items-center justify-center">
        {gameState === 'start' && <StartScreen />}
        {gameState === 'playing' && <QuestionScreen />}
        {gameState === 'result' && <ResultScreen />}
      </CardContent>
    </Card>
  );
}
