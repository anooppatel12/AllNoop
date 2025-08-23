
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; score: number }[]; // 2 for main, 1 for side, 0 for extra
};

const questions: Question[] = [
  {
    text: "When you walk into a party, your first move is:",
    answers: [
      { text: 'Scan the room for the most interesting group and make a grand entrance.', score: 2 },
      { text: 'Find your friends and stick with them for the night.', score: 1 },
      { text: 'Head straight to the snacks and observe from a safe distance.', score: 0 },
    ],
  },
  {
    text: "Your life's soundtrack is currently:",
    answers: [
      { text: 'A trending TikTok song that perfectly captures my current emotional arc.', score: 2 },
      { text: 'A curated playlist that only my close friends would get.', score: 1 },
      { text: 'Just the ambient noise of the city, I guess?', score: 0 },
    ],
  },
  {
    text: 'A minor inconvenience happens (e.g., spilling coffee). You think:',
    answers: [
      { text: '"This is so me. Just another hilarious chapter in my chaotic life story."', score: 2 },
      { text: '"Ugh, of course this would happen. So annoying."', score: 1 },
      { text: '"Great. Now I have to clean this up."', score: 0 },
    ],
  },
  {
    text: 'How do you dress for a casual coffee run?',
    answers: [
      { text: 'A carefully curated "effortless" look. You never know who you\'ll run into.', score: 2 },
      { text: 'Jeans and a comfy top. The usual.', score: 1 },
      { text: 'Whatever I grabbed off the floor first. It\'s just coffee.', score: 0 },
    ],
  },
   {
    text: 'Your social media presence is:',
    answers: [
      { text: 'A well-maintained grid with story highlights for every major life event.', score: 2 },
      { text: 'Mostly memes and occasional photos with friends.', score: 1 },
      { text: 'I have an account, but I mostly just lurk.', score: 0 },
    ],
  },
];

const results = {
  main: { title: 'Main Character 🎬✨', advice: 'You are the moment. Your life has a plot, a soundtrack, and probably a few love interests. Keep shining, star!', color: 'text-amber-400' },
  side: { title: 'Supportive Side Character 😅', advice: 'You\'re the reliable, funny best friend! You get the best one-liners and everyone loves you. The story wouldn\'t be the same without you.', color: 'text-blue-400' },
  extra: { title: 'Background Extra 🪑', advice: 'You\'re an essential part of the scenery, adding atmosphere and realism. You\'re low-drama, unproblematic, and just vibing. We respect it.', color: 'text-gray-400' },
};

export function MainCharacterQuiz() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalResultKey, setFinalResultKey] = useState<keyof typeof results | null>(null);

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const finalScore = score + points;
      if(finalScore >= 7) setFinalResultKey('main');
      else if (finalScore >= 3) setFinalResultKey('side');
      else setFinalResultKey('extra');
      setGameState('result');
    }
  };
  
  const restartGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setFinalResultKey(null);
    setGameState('start');
  };
  
  const handleShare = () => {
    if(!finalResultKey) return;
    const result = results[finalResultKey];
    const shareText = `My vibe is... ${result.title}! Find out if you have main character energy:`;
    const shareUrl = window.location.href;
    
    if(navigator.share) {
        navigator.share({
            title: 'Main Character Quiz',
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
      <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
      <h2 className="text-2xl font-bold">Are You the Main Character?</h2>
      <p className="text-muted-foreground">Or are you just living in their world? Let's find out if you have *that* energy.</p>
      <Button onClick={() => setGameState('playing')} size="lg" className="text-lg">Start the Quiz</Button>
    </motion.div>
  );

  const ResultScreen = () => {
    if(!finalResultKey) return null;
    const result = results[finalResultKey];
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
                <Button onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4"/>
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
