
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Flag, Heart, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; score: number }[]; // Positive for green, negative for red
};

const questions: Question[] = [
  {
    text: "They surprise you with your favorite snack just because.",
    answers: [ { text: "Yes, all the time!", score: 2 }, { text: "Sometimes", score: 1 }, { text: "Never", score: -1 } ]
  },
  {
    text: "How do they handle disagreements?",
    answers: [ { text: "We talk it out calmly.", score: 2 }, { text: "They get defensive.", score: -1 }, { text: "They give me the silent treatment.", score: -2 } ]
  },
  {
    text: "They support your personal goals and hobbies.",
    answers: [ { text: "Always, they're my biggest cheerleader!", score: 2 }, { text: "They don't really get it, but they try.", score: 1 }, { text: "They think it's a waste of time.", score: -2 } ]
  },
  {
    text: "They remember small details about you.",
    answers: [ { text: "Yes, it's amazing!", score: 2 }, { text: "They forget sometimes.", score: 0 }, { text: "I have to remind them constantly.", score: -1 } ]
  },
  {
    text: "They check your phone without asking.",
    answers: [ { text: "Never.", score: 2 }, { text: "Once or twice.", score: -1 }, { text: "Yes, it's a regular thing.", score: -2 } ]
  },
  {
    text: "How do they talk about their exes?",
    answers: [ { text: "Respectfully, or not at all.", score: 2 }, { text: "They're still friends, which is cool.", score: 1 }, { text: "They call them 'crazy'.", score: -2 } ]
  },
  {
    text: "They respect your boundaries (e.g., needing alone time).",
    answers: [ { text: "Absolutely.", score: 2 }, { text: "They get a little pouty but respect it.", score: 1 }, { text: "They make me feel guilty for it.", score: -2 } ]
  },
  {
    text: "They make an effort with your friends and family.",
    answers: [ { text: "Yes, everyone loves them!", score: 2 }, { text: "They are polite but distant.", score: 0 }, { text: "They actively avoid them.", score: -1 } ]
  },
];

type GameState = 'start' | 'playing' | 'result';

export function GreenFlagRedFlagGame() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerScore: number) => {
    setScore(prev => prev + answerScore);
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
    if(score >= 10) return { title: "Field of Green Flags! ✅", color: "text-green-500", advice: "You've got a real keeper! This relationship sounds healthy, supportive, and full of positive vibes." };
    if(score >= 5) return { title: "Mostly Green! 😊", color: "text-green-400", advice: "Things are looking pretty good! A few little quirks, but the foundation is solid." };
    if(score > -5) return { title: "Beige Flags... 🤔", color: "text-yellow-500", advice: "It's a mixed bag. Not terrible, but there are some areas to watch and talk about. Communication is key!" };
    if(score > -10) return { title: "Caution: Red Flags Ahead! 🚩", color: "text-orange-500", advice: "Hmm, there are some concerning signs. It might be time for a serious conversation about your needs." };
    return { title: "Run! It's a Red Flag Parade! 🚩🚩🚩", color: "text-red-500", advice: "Warning! These signs point to a potentially unhealthy dynamic. Prioritize your well-being." };
  }
  
  const handleShare = () => {
    const result = getResult();
    const shareText = `I played 'Green Flag or Red Flag' and my partner is... ${result.title}! Find out yours here:`;
    const shareUrl = window.location.href;
    
    if(navigator.share) {
        navigator.share({
            title: 'Green Flag or Red Flag Game',
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
      <Heart className="mx-auto h-16 w-16 text-primary animate-pulse" />
      <h2 className="text-2xl font-bold">Is Your Partner a Keeper?</h2>
      <p className="text-muted-foreground">Answer these questions to find out if you're seeing green flags or red flags in your relationship.</p>
      <Button onClick={() => setGameState('playing')} size="lg" className="text-lg">Start Quiz</Button>
    </motion.div>
  );

  const ResultScreen = () => {
    const result = getResult();
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h2 className={cn("text-3xl font-bold", result.color)}>{result.title}</h2>
            <Card className="bg-background/50">
                <CardContent className="p-6">
                    <p>{result.advice}</p>
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
                className="space-y-6"
            >
                <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full" />
                <h2 className="text-2xl font-semibold text-center min-h-[6rem] flex items-center justify-center">{question.text}</h2>
                <div className="grid grid-cols-1 gap-4">
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
      <CardContent className="p-8 min-h-[350px] flex items-center justify-center">
        {gameState === 'start' && <StartScreen />}
        {gameState === 'playing' && <QuestionScreen />}
        {gameState === 'result' && <ResultScreen />}
      </CardContent>
    </Card>
  );
}
