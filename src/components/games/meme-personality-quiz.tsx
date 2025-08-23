
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Share2, HelpCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; points: { [key: string]: number } }[];
};

type MemePersonality = 'ThisIsFine' | 'DistractedBoyfriend' | 'Drake' | 'SideEye';

const questions: Question[] = [
  {
    text: "Your go-to snack when you're stressed is:",
    answers: [
      { text: "Something crunchy, like chips.", points: { DistractedBoyfriend: 2 } },
      { text: "Comfort food, like pizza or mac & cheese.", points: { ThisIsFine: 3 } },
      { text: "I'm too busy panicking to eat.", points: { SideEye: 2 } },
      { text: "Whatever is easiest to grab.", points: { Drake: 1 } },
    ],
  },
  {
    text: "How do you reply to your friends' questionable life choices in the group chat?",
    answers: [
      { text: "A single, judgmental emoji: 👀", points: { SideEye: 3 } },
      { text: "With a meme, obviously.", points: { Drake: 2 } },
      { text: "A supportive but concerned paragraph.", points: { ThisIsFine: 2 } },
      { text: "I'm the one making the questionable choices.", points: { DistractedBoyfriend: 3 } },
    ],
  },
   {
    text: "Your camera roll is mostly:",
    answers: [
      { text: "Screenshots of things I'll never look at again.", points: { DistractedBoyfriend: 3, Drake: 1 } },
      { text: "Aesthetic pictures of my coffee.", points: { Drake: 2 } },
      { text: "Photos of my pet.", points: { ThisIsFine: 2 } },
      { text: "Selfies with a suspicious look on my face.", points: { SideEye: 3 } },
    ],
  },
  {
    text: "When faced with a mountain of work, you:",
    answers: [
      { text: "Pretend everything is okay while internally screaming.", points: { ThisIsFine: 3 } },
      { text: "Immediately get distracted by a new, more exciting project.", points: { DistractedBoyfriend: 3 } },
      { text: "Politely decline and delegate it.", points: { Drake: 2 } },
      { text: "Stare at the work, then stare at the person who gave it to you.", points: { SideEye: 2 } },
    ],
  },
];

const results: { [key in MemePersonality]: { title: string; description: string; emoji: string; color: string } } = {
  ThisIsFine: {
    title: 'This Is Fine Dog',
    description: "You're the master of calm amidst the chaos. While the world burns around you, you're just sipping your coffee, pretending everything is under control. It's a skill, really.",
    emoji: '🔥🐶',
    color: 'text-orange-500',
  },
  DistractedBoyfriend: {
    title: 'Distracted Boyfriend',
    description: "You're loyal... until something new and shiny comes along. Your attention span is legendary for its briefness, and you're always chasing the next exciting thing.",
    emoji: '👀🚶‍♀️',
    color: 'text-blue-500',
  },
  Drake: {
    title: 'Drakeposting',
    description: "You have strong opinions and you're not afraid to show them. You know what you like and what you don't, and you'll happily approve or disapprove of anything.",
    emoji: '🙅‍♂️👍',
    color: 'text-amber-500',
  },
  SideEye: {
    title: 'Side-Eyeing Chloe',
    description: "You are eternally unimpressed and suspicious of everything. Your signature side-eye is iconic, and you serve it to anyone who says something even remotely weird.",
    emoji: '😒',
    color: 'text-purple-500',
  },
};

export function MemePersonalityQuiz() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [scores, setScores] = useState<{ [key: string]: number }>({ ThisIsFine: 0, DistractedBoyfriend: 0, Drake: 0, SideEye: 0 });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalResult, setFinalResult] = useState<MemePersonality | null>(null);

  const handleAnswer = (points: { [key: string]: number }) => {
    const newScores = { ...scores };
    for (const char in points) {
      newScores[char] += points[char];
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let maxScore = -1;
      let resultChar: MemePersonality = 'ThisIsFine';
      for (const char in newScores) {
        if (newScores[char] > maxScore) {
          maxScore = newScores[char];
          resultChar = char as MemePersonality;
        }
      }
      setFinalResult(resultChar);
      setGameState('result');
    }
  };

  const restartGame = () => {
    setScores({ ThisIsFine: 0, DistractedBoyfriend: 0, Drake: 0, SideEye: 0 });
    setCurrentQuestionIndex(0);
    setFinalResult(null);
    setGameState('start');
  };
  
   const handleShare = () => {
    if(!finalResult) return;
    const result = results[finalResult];
    const shareText = `My meme personality is... ${result.title} ${result.emoji}! Find out yours here:`;
    const shareUrl = window.location.href;
    
    if(navigator.share) {
        navigator.share({
            title: 'Meme Personality Quiz',
            text: shareText,
            url: shareUrl,
        });
    } else {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({ title: "Result copied to clipboard!", description: "Share it with your friends!" });
    }
  }

  const StartScreen = () => (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
      <HelpCircle className="mx-auto h-16 w-16 text-primary animate-pulse" />
      <h2 className="text-2xl font-bold">Which Famous Meme Are You?</h2>
      <p className="text-muted-foreground">Your snack choices and texting habits are about to reveal your true meme identity.</p>
      <Button onClick={() => setGameState('playing')} size="lg" className="text-lg">Start Quiz</Button>
    </motion.div>
  );

  const ResultScreen = () => {
    if (!finalResult) return null;
    const result = results[finalResult];
    return (
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <p className={cn("text-7xl")}>{result.emoji}</p>
        <h2 className={cn("text-3xl font-bold", result.color)}>{result.title}</h2>
        <Card className="bg-background/50">
          <CardContent className="p-6">
            <p>{result.description}</p>
          </CardContent>
        </Card>
        <div className="flex gap-4 justify-center">
          <Button onClick={restartGame} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Result
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(answer.points)}
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
    );
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
