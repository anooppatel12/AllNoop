'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clapperboard, RefreshCw, Share2, User, Users, VenetianMask } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; points: { [key: string]: number } }[];
};

type Character = 'Kabir' | 'Bunny' | 'Poo' | 'Geet' | 'Raj' | 'Circuit' | 'Rani';
type Gender = 'male' | 'female' | 'other';
type GameState = 'start' | 'gender-select' | 'playing' | 'result';

const questionsMale: Question[] = [
  { text: "Your ideal first date involves:", answers: [ { text: "A spontaneous road trip to a hidden gem.", points: { Bunny: 3 } }, { text: "A perfectly planned, romantic dinner.", points: { Raj: 3 } }, { text: "Something intense and competitive, like a sports match.", points: { Kabir: 3 } } ] },
  { text: "When you're angry at your partner, you:", answers: [ { text: "Need some space to cool off and think.", points: { Bunny: 3, Raj: 1 } }, { text: "Confront the issue head-on, with passion.", points: { Kabir: 3 } }, { text: "Make a grand, dramatic gesture to show your displeasure.", points: { Raj: 3 } } ] },
  { text: "Your love language is primarily:", answers: [ { text: "Grand gestures and surprises.", points: { Raj: 3 } }, { text: "Quality time and shared experiences.", points: { Bunny: 3 } }, { text: "Physical touch and fierce loyalty.", points: { Kabir: 3 } } ] },
  { text: "The perfect proposal is:", answers: [ { text: "On a mountain top after a long trek.", points: { Bunny: 3 } }, { text: "In the middle of a European field with a mandolin.", points: { Raj: 3 } }, { text: "I don't do proposals, I do declarations.", points: { Kabir: 3 } } ] },
];

const questionsFemale: Question[] = [
  { text: "Your go-to flirting style is:", answers: [ { text: "Witty banter and a playful challenge.", points: { Geet: 3 } }, { text: "Making them know you're the prize.", points: { Poo: 3 } }, { text: "A mix of shyness and charm.", points: { Rani: 2 } } ] },
  { text: "When you're angry, you're most likely to:", answers: [ { text: "Give them the silent treatment until they figure it out.", points: { Poo: 3 } }, { text: "Say exactly what's on your mind, loudly.", points: { Geet: 3 } }, { text: "Cry and go on a solo trip to Paris.", points: { Rani: 3 } } ] },
  { text: "Your ideal partner is someone who:", answers: [ { text: "Loves you for your chaotic energy and joins your adventures.", points: { Geet: 3 } }, { text: "Adores you and isn't afraid to show it off.", points: { Poo: 3 } }, { text: "Helps you discover your own strength.", points: { Rani: 3 } } ] },
];

const questionsGeneral: Question[] = [
  { text: "What's your role in your friend group?", answers: [ { text: "The ultra-loyal sidekick who's always there.", points: { Circuit: 3 } }, { text: "The one who needs a little push to find their confidence.", points: { Rani: 3 } }, { text: "The problem-solver, but in a weird way.", points: { Circuit: 2 } } ] },
  { text: "A perfect day is:", answers: [ { text: "Discovering a new city all by yourself.", points: { Rani: 3 } }, { text: "Helping my best friend with their crazy scheme.", points: { Circuit: 3 } }, { text: "Trying every single street food stall.", points: { Rani: 2, Circuit: 1 } } ] },
  { text: "Your life motto is:", answers: [ { text: "\"Tension lene ka nahi, sirf dene ka.\"", points: { Circuit: 3 } }, { text: "\"My lehenga is very expensive.\"", points: { Rani: 3 } }, { text: "\"Bhai ne bola karne ka, toh karne ka.\"", points: { Circuit: 3 } } ] },
];


const results: { [key in Character]: { title: string, emoji: string, advice: string, color: string } } = {
  Kabir: { title: 'You = Kabir Singh', emoji: '😬', advice: 'Your love is passionate and intense, but maybe... just a little less breaking things? Just a thought.', color: 'text-red-500' },
  Bunny: { title: 'You = Bunny from YJHD', emoji: '✈️', advice: 'You have a case of wanderlust and big dreams! Just don\'t forget to cherish the people waiting for you at home.', color: 'text-blue-500' },
  Poo: { title: 'You = Poo from K3G', emoji: '💅', advice: 'You are iconic, fabulous, and you know it. Your confidence is everything, just remember to be nice to Rohan.', color: 'text-pink-500' },
  Geet: { title: 'You = Geet from Jab We Met', emoji: '🚂', advice: 'You are a bundle of joy and self-love! Your energy is infectious, just make sure you don\'t miss your train.', color: 'text-orange-500' },
  Raj: { title: 'You = Raj from DDLJ', emoji: '❤️', advice: 'You\'re a classic romantic with a heart of gold. You\'d cross oceans (or Europe) for love. Palat!', color: 'text-yellow-500' },
  Circuit: { title: 'You = Circuit from Munnabhai', emoji: '😂', advice: 'You are the definition of a ride-or-die friend. Your loyalty is legendary, just like your fashion sense. Bhai ne bola, matlab final!', color: 'text-green-500' },
  Rani: { title: 'You = Rani from Queen', emoji: '👑', advice: 'You are on a journey of self-discovery and finding your own strength. Your story is an inspiration to many!', color: 'text-purple-500' },
};


export function BollywoodPersonalityQuiz() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalResult, setFinalResult] = useState<Character | null>(null);

  const handleGenderSelect = (gender: Gender) => {
    let selectedQuestions: Question[] = [];
    if (gender === 'male') selectedQuestions = questionsMale;
    else if (gender === 'female') selectedQuestions = questionsFemale;
    else selectedQuestions = questionsGeneral;
    
    setQuestions(selectedQuestions);
    const initialScores: { [key: string]: number } = {};
    selectedQuestions.flatMap(q => q.answers).forEach(a => {
        Object.keys(a.points).forEach(char => {
            initialScores[char] = 0;
        });
    });
    setScores(initialScores);
    setGameState('playing');
  }

  const handleAnswer = (points: { [key: string]: number }) => {
    const newScores = { ...scores };
    for (const char in points) {
      if(newScores.hasOwnProperty(char)){
        newScores[char] += points[char];
      }
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let maxScore = -1;
      let resultChar: Character = 'Bunny'; // default fallback
      for(const char in newScores){
          if(newScores[char] > maxScore){
              maxScore = newScores[char];
              resultChar = char as Character;
          }
      }
      setFinalResult(resultChar);
      setGameState('result');
    }
  };
  
  const restartGame = () => {
    setScores({});
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
      <Button onClick={() => setGameState('gender-select')} size="lg" className="text-lg">Start Quiz</Button>
    </motion.div>
  );
  
  const GenderSelectScreen = () => (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h2 className="text-2xl font-bold">I'm interested in...</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => handleGenderSelect('female')} size="lg" variant="outline" className="h-24 flex-col text-lg"><User className="mb-2"/>Women</Button>
            <Button onClick={() => handleGenderSelect('male')} size="lg" variant="outline" className="h-24 flex-col text-lg"><User className="mb-2"/>Men</Button>
            <Button onClick={() => handleGenderSelect('other')} size="lg" variant="outline" className="h-24 flex-col text-lg"><Users className="mb-2"/>Everyone</Button>
        </div>
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
      if (questions.length === 0) return null;
      const question = questions[currentQuestionIndex];
      if (!question) return null;
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
        {gameState === 'gender-select' && <GenderSelectScreen />}
        {gameState === 'playing' && <QuestionScreen />}
        {gameState === 'result' && <ResultScreen />}
      </CardContent>
    </Card>
  );
}
