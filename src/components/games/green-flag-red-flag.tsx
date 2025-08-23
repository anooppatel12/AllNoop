
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, RefreshCw, Share2, VenetianMask, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Question = {
  text: string;
  answers: { text: string; score: number }[]; // Positive for green, negative for red
};

const questionsMale: Question[] = [
  { text: "She respects your 'guy time' without making you feel guilty.", answers: [ { text: "Yes, she encourages it!", score: 2 }, { text: "She tolerates it.", score: 1 }, { text: "No, it's always an issue.", score: -2 } ] },
  { text: "How does she react when you're stressed or having a bad day?", answers: [ { text: "She gives me space but checks in.", score: 2 }, { text: "She tries to fix it immediately.", score: 0 }, { text: "She makes it about herself.", score: -2 } ] },
  { text: "She supports your career ambitions.", answers: [ { text: "Absolutely, she's my biggest fan.", score: 2 }, { text: "She's indifferent.", score: 0 }, { text: "She seems competitive or unsupportive.", score: -2 } ] },
  { text: "She's financially responsible and has her own goals.", answers: [ { text: "Yes, we're a team.", score: 2 }, { text: "She relies on me for everything.", score: -1 }, { text: "Her spending habits worry me.", score: -2 } ] },
  { text: "How does she handle your hobbies (e.g., gaming, sports)?", answers: [ { text: "She shows interest or joins in sometimes.", score: 2 }, { text: "She ignores them.", score: 0 }, { text: "She complains about them.", score: -1 } ] },
  { text: "She is confident and secure in herself.", answers: [ { text: "Yes, completely.", score: 2 }, { text: "She has moments of insecurity.", score: 0 }, { text: "She requires constant validation.", score: -2 } ] },
  { text: "She communicates her feelings and needs clearly.", answers: [ { text: "Yes, we have great communication.", score: 2 }, { text: "I have to guess what she's thinking.", score: -1 }, { text: "She expects me to be a mind reader.", score: -2 } ] },
  { text: "She gets along well with your friends and family.", answers: [ { text: "Yes, they all love her.", score: 2 }, { text: "She's polite but keeps her distance.", score: 0 }, { text: "No, there's always drama.", score: -2 } ] }
];

const questionsFemale: Question[] = [
  { text: "He actively listens and remembers small details from your conversations.", answers: [ { text: "All the time, it's so sweet.", score: 2 }, { text: "Sometimes, but he can be forgetful.", score: 0 }, { text: "No, I have to repeat myself often.", score: -2 } ] },
  { text: "How does he react when you express vulnerability?", answers: [ { text: "He's gentle, reassuring, and supportive.", score: 2 }, { text: "He gets awkward and changes the subject.", score: -1 }, { text: "He uses it against me later.", score: -2 } ] },
  { text: "He respects your boundaries and says 'no' without making you feel guilty.", answers: [ { text: "Always, without question.", score: 2 }, { text: "He might push a little, but respects it.", score: 0 }, { text: "He gets upset or tries to guilt trip me.", score: -2 } ] },
  { text: "He makes an effort with your friends and family.", answers: [ { text: "Yes, he fits right in!", score: 2 }, { text: "He'll come, but doesn't engage much.", score: 0 }, { text: "He actively avoids them or complains.", score: -1 } ] },
  { text: "He talks about his exes... a lot.", answers: [ { text: "No, he's focused on us.", score: 2 }, { text: "Sometimes, but it's neutral.", score: 0 }, { text: "Yes, and he always calls them 'crazy'.", score: -2 } ] },
  { text: "He is supportive of your career and personal growth.", answers: [ { text: "He's my biggest cheerleader!", score: 2 }, { text: "He's indifferent.", score: 0 }, { text: "He seems threatened or dismissive.", score: -2 } ] },
  { text: "How does he handle his emotions?", answers: [ { text: "He's emotionally intelligent and communicates.", score: 2 }, { text: "He shuts down and avoids talking.", score: -1 }, { text: "He has angry outbursts.", score: -2 } ] },
  { text: "He makes you feel safe and secure in the relationship.", answers: [ { text: "Yes, completely.", score: 2 }, { text: "Most of the time.", score: 1 }, { text: "No, I often feel anxious or on edge.", score: -2 } ] }
];

const questionsGeneral: Question[] = [
  { text: "They surprise you with your favorite snack just because.", answers: [ { text: "Yes, all the time!", score: 2 }, { text: "Sometimes", score: 1 }, { text: "Never", score: -1 } ] },
  { text: "How do they handle disagreements?", answers: [ { text: "We talk it out calmly.", score: 2 }, { text: "They get defensive.", score: -1 }, { text: "They give me the silent treatment.", score: -2 } ] },
  { text: "They support your personal goals and hobbies.", answers: [ { text: "Always, they're my biggest cheerleader!", score: 2 }, { text: "They don't really get it, but they try.", score: 1 }, { text: "They think it's a waste of time.", score: -2 } ] },
  { text: "They remember small details about you.", answers: [ { text: "Yes, it's amazing!", score: 2 }, { text: "They forget sometimes.", score: 0 }, { text: "I have to remind them constantly.", score: -1 } ] },
  { text: "They check your phone without asking.", answers: [ { text: "Never.", score: 2 }, { text: "Once or twice.", score: -1 }, { text: "Yes, it's a regular thing.", score: -2 } ] },
  { text: "How do they talk about their exes?", answers: [ { text: "Respectfully, or not at all.", score: 2 }, { text: "They're still friends, which is cool.", score: 1 }, { text: "They call them 'crazy'.", score: -2 } ] },
  { text: "They respect your boundaries (e.g., needing alone time).", answers: [ { text: "Absolutely.", score: 2 }, { text: "They get a little pouty but respect it.", score: 1 }, { text: "They make me feel guilty for it.", score: -2 } ] },
  { text: "They make an effort with your friends and family.", answers: [ { text: "Yes, everyone loves them!", score: 2 }, { text: "They are polite but distant.", score: 0 }, { text: "They actively avoid them.", score: -1 } ] }
];

type GameState = 'start' | 'gender-select' | 'playing' | 'result';
type Gender = 'male' | 'female' | 'other';

export function GreenFlagRedFlagGame() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('start');
  const [gender, setGender] = useState<Gender | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    if (selectedGender === 'male') setQuestions(questionsMale);
    else if (selectedGender === 'female') setQuestions(questionsFemale);
    else setQuestions(questionsGeneral);
    setGameState('playing');
  };

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
    setGender(null);
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
        <p className="text-xs text-muted-foreground pt-2">Select an option to get more relevant questions.</p>
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
      if (questions.length === 0) return null;
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
        {gameState === 'gender-select' && <GenderSelectScreen />}
        {gameState === 'playing' && <QuestionScreen />}
        {gameState === 'result' && <ResultScreen />}
      </CardContent>
    </Card>
  );
}
