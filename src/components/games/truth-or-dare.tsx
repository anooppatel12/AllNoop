
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, RefreshCw, MessageSquare, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const truths = [
    "Apni crush ka naam type karo 👀",
    "Apni last lie batao 😅",
    "Sabse weird cheez jo tumne kabhi khai hai?",
    "Phone ka wallpaper dikhao (screenshot lo!)",
    "Ek aisi movie jiske liye tum roye the?",
    "Tumhara sabse embarrassing moment konsa tha?",
    "Agar tum ek din invisible ho jao toh kya karoge?",
    "Your most-used emoji?",
];

const dares = [
    "Apni last Google search yahan likho 🔍",
    "Apna ek embarrassing secret share karo 🤭",
    "Write a short, funny poem about your favorite food.",
    "Text your best friend 'I'm a unicorn' and nothing else.",
    "Apne gallery se 5th photo ka description do.",
    "Do a 10-second stand-up comedy routine in your answer.",
    "Sing the chorus of your current favorite song.",
    "Change your profile picture to a vegetable for 10 minutes."
];

type GameState = 'start' | 'playing';
type Prompt = { type: 'Truth' | 'Dare', text: string };

export function TruthOrDare() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerName, setPlayerName] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [answer, setAnswer] = useState('');

  const generatePrompt = () => {
    const isTruth = Math.random() > 0.5;
    if (isTruth) {
      const randomTruth = truths[Math.floor(Math.random() * truths.length)];
      setCurrentPrompt({ type: 'Truth', text: randomTruth });
    } else {
      const randomDare = dares[Math.floor(Math.random() * dares.length)];
      setCurrentPrompt({ type: 'Dare', text: randomDare });
    }
    setAnswer('');
  };

  const startGame = () => {
    if (playerName.trim()) {
      generatePrompt();
      setGameState('playing');
    }
  };
  
  const handleShare = () => {
      if(!currentPrompt) return;
      const shareText = `${playerName}'s Answer!\n\n${currentPrompt.type}: ${currentPrompt.text}\n\nAnswer: ${answer || '(Not answered yet!)'}`;
      navigator.clipboard.writeText(shareText);
      toast({title: "Copied to clipboard!", description: "Share it with your friends."});
  }
  
  const StartScreen = () => (
    <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Truth or Dare!</h2>
        <div className="space-y-2">
            <Label htmlFor="player-name">Enter Your Name</Label>
            <Input 
                id="player-name" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                placeholder="Your Name"
                className="w-full max-w-sm mx-auto"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
            />
        </div>
        <Button onClick={startGame} size="lg" disabled={!playerName.trim()}>Start Game</Button>
    </div>
  );
  
  const PlayingScreen = () => {
      if(!currentPrompt) return null;
      
      const isTruth = currentPrompt.type === 'Truth';
      
      return (
          <div className="space-y-6">
              <AnimatePresence mode="wait">
                 <motion.div
                    key={currentPrompt.text}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center"
                 >
                    <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-white", isTruth ? "bg-sky-500" : "bg-rose-500")}>
                        {isTruth ? <MessageSquare className="h-5 w-5"/> : <Flame className="h-5 w-5"/>}
                        <h2 className="text-xl font-bold">{currentPrompt.type}</h2>
                    </div>
                    <p className="mt-4 text-2xl font-semibold min-h-[6rem]">{currentPrompt.text}</p>
                 </motion.div>
              </AnimatePresence>
               <div className="space-y-2">
                <Label htmlFor="answer-area">{playerName}'s Answer</Label>
                <Textarea 
                    id="answer-area"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={3}
                />
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={generatePrompt} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Next
                </Button>
                <Button onClick={handleShare}>
                    <Copy className="mr-2 h-4 w-4" /> Copy & Share
                </Button>
               </div>
          </div>
      )
  }

  return (
    <Card className="mt-8 mx-auto max-w-lg min-h-[400px] flex items-center justify-center">
      <CardContent className="p-8 w-full">
        {gameState === 'start' ? <StartScreen /> : <PlayingScreen />}
      </CardContent>
    </Card>
  );
}
