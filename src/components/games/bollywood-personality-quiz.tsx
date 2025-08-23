
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clapperboard, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; points: { [key: string]: number } }[];
};

type Character = 'Kabir' | 'Bunny' | 'Poo' | 'Geet' | 'Raj';

const questions: Question[] = [
  {
    text: "It's Friday night. Your ideal date is:",
    answers: [
      { text: 'A spontaneous road trip to nowhere.', points: { Bunny: 3 } },
      { text: 'Getting dressed up for the fanciest party in town.', points: { Poo: 3 } },
      { text: 'A quiet, intense evening with just the two of us.', points: { Kabir: 3 } },
      { text: 'Singing songs in a mustard field.', points: { Raj: 3 } },
      { text: 'Crashing a wedding, obviously.', points: { Geet: 3 } },
    ],
  },
  {
    text: 'How do you handle a major disagreement?',
    answers: [
      { text: 'Avoidance. I\'ll just book a flight and deal with it later.', points: { Bunny: 3 } },
      { text: 'I don\'t do disagreements. I\'m always right.', points: { Poo: 3, Kabir: 1 } },
      { text: 'Intense, passionate argument. Things might get broken.', points: { Kabir: 3 } },
      { text: 'I talk... a lot. Until they agree with me.', points: { Geet: 3 } },
      { text: 'Apologize, even if it wasn\'t my fault, just to make peace.', points: { Raj: 3 } },
    ],
  },
  {
    text: 'Your personal style is best described as:',
    answers: [
      { text: '"Whatever is clean and comfortable for my next adventure."', points: { Bunny: 3 } },
      { text: 'P.H.A.T: Pretty, Hot, and Tempting.', points: { Poo: 3 } },
      { text: 'Whatever. My brooding look is my main accessory.', points: { Kabir: 3 } },
      { text: '"Main apni favourite hoon!" fashion.', points: { Geet: 3 } },
      { text: 'Classic leather jacket and a winning smile.', points: { Raj: 3 } },
    ],
  },
  {
    text: 'What\'s your philosophy on love?',
    answers: [
      { text: 'Love is great, but my career and dreams come first.', points: { Bunny: 3 } },
      { text: 'Love is about finding someone who worships me.', points: { Poo: 3 } },
      { text: 'It\'s all-consuming, passionate, and a little bit dangerous.', points: { Kabir: 3 } },
      { text: 'If it\'s meant to be, they\'ll catch the train.', points: { Geet: 3, Raj: 1 } },
      { text: '"Bade bade deshon mein aisi choti choti baatein hoti rehti hai."', points: { Raj: 3 } },
    ],
  },
];

const results: { [key in Character]: { title: string, emoji: string, advice: string, color: string } } = {
  Kabir: { title: 'You are Kabir Singh', emoji: '😬', advice: 'Your love is passionate and intense, but maybe... just a little less breaking things? Just a thought.', color: 'text-red-500' },
  Bunny: { title: 'You are Bunny from YJHD', emoji: '✈️', advice: 'You have a case of wanderlust and big dreams! Just don\'t forget to cherish the people waiting for you at home.', color: 'text-blue-500' },
  Poo: { title: 'You are Poo from K3G', emoji: '💅', advice: 'You are iconic, fabulous, and you know it. Your confidence is everything, just remember to be nice to Rohan.', color: 'text-pink-500' },
  Geet: { title: 'You are Geet from Jab We Met', emoji: '🚂', advice: 'You are a bundle of joy and self-love! Your energy is infectious, just make sure you don\'t miss your train.', color: 'text-orange-500' },
  Raj: { title: 'You are Raj from DDLJ', emoji: '❤️', advice: 'You\'re a classic romantic with a heart of gold. You\'d cross oceans (or Europe) for love. Palat!', color: 'text-yellow-500' },
};


export function BollywoodPersonalityQuiz() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [scores, setScores] = useState<{ [key in Character]: number }>({ Kabir: 0, Bunny: 0, Poo: 0, Geet: 0, Raj: 0 });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalResult, setFinalResult] = useState<Character | null>(null);

  const handleAnswer = (points: { [key: string]: number }) => {
    const newScores = { ...scores };
    for (const char in points) {
      newScores[char as Character] += points[char as Character];
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let maxScore = -1;
      let resultChar: Character = 'Bunny';
      for(const char in newScores){
          if(newScores[char as Character] > maxScore){
              maxScore = newScores[char as Character];
              resultChar = char as Character;
          }
      }
      setFinalResult(resultChar);
      setGameState('result');
    }
  };
  
  const restartGame = () => {
    setScores({ Kabir: 0, Bunny: 0, Poo: 0, Geet: 0, Raj: 0 });
    setCurrentQuestionIndex(0);
    setFinalResult(null);
    setGameState('start');
  };
  
  const handleShare = () => {
    if(!finalResult) return;
    const result = results[finalResult];
    const shareText = `My Bollywood relationship type is... ${result.title} ${result.emoji}! Find out yours here:`;
    const shareUrl = window.location.href;
    
    if(navigator.share) {
        navigator.share({
            title: 'Bollywood Personality Quiz',
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
      <Clapperboard className="mx-auto h-16 w-16 text-primary animate-pulse" />
      <h2 className="text-2xl font-bold">Which Bollywood Character Are You in a Relationship?</h2>
      <p className="text-muted-foreground">Are you a hopeless romantic like Raj or a carefree spirit like Bunny? Let's find out!</p>
      <Button onClick={() => setGameState('playing')} size="lg" className="text-lg">Start Quiz</Button>
    </motion.div>
  );

  const ResultScreen = () => {
    if(!finalResult) return null;
    const result = results[finalResult];
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className={cn("text-7xl", result.color)}>{result.emoji}</p>
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
                <div className="grid grid-cols-1 gap-3">
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
      )
  };


  return (
    <Card className="mt-8 mx-auto max-w-2xl overflow-hidden">
      <CardContent className="p-8 min-h-[400px] flex items-center justify-center">
        {gameState === 'start' && <StartScreen />}
        {gameState === 'playing' && <QuestionScreen />}
        {gameState === 'result' && <ResultScreen />}
      </CardContent>
    </Card>
  );
}
