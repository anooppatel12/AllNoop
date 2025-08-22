'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const easyText = "the quick brown fox jumps over the lazy dog a man a plan a canal panama hello world practice makes perfect see you later alligator";
const mediumText = "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, innovation continues to shape our future. The internet connects billions of people, providing access to information and opportunities like never before.";
const hardText = "The 2021 CKD-EPI equation (eGFR = 142 * min(Scr/κ, 1)^α * max(Scr/κ, 1)^-1.200 * 0.9938^Age * 1.012 [if female]) is quite complex. It's often written as `Scr/κ` where κ is 0.7 (female) or 0.9 (male) & α is -0.241 (female) or -0.302 (male).";

const sampleTexts: { [key: string]: string[] } = {
  easy: easyText.split(' '),
  medium: mediumText.split(' '),
  hard: hardText.split(' '),
};

const durations = {
    '15s': 15,
    '30s': 30,
    '60s': 60,
    '120s': 120
};

type GameState = 'waiting' | 'running' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard';
type Duration = keyof typeof durations;


export function TypingSpeedTest() {
  const [words, setWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [duration, setDuration] = useState<Duration>('30s');
  const [timeLeft, setTimeLeft] = useState(durations[duration]);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const generateWords = useCallback(() => {
    const textOptions = sampleTexts[difficulty];
    // Generate a long list of words to ensure it's enough for the duration
    let generatedWords = [];
    for (let i = 0; i < 200; i++) {
        generatedWords.push(textOptions[Math.floor(Math.random() * textOptions.length)]);
    }
    setWords(generatedWords);
  }, [difficulty]);

  useEffect(() => {
    generateWords();
  }, [generateWords]);

  const startTest = useCallback(() => {
    generateWords();
    setInputValue('');
    setCurrentWordIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(0);
    setTimeLeft(durations[duration]);
    setGameState('waiting');
    if(inputRef.current) {
        inputRef.current.focus();
    }
  }, [duration, generateWords]);

  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
      const totalChars = correctChars + incorrectChars;
      const calculatedWpm = (correctChars / 5) / (durations[duration] / 60);
      const calculatedAccuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
    }
  }, [gameState, timeLeft, correctChars, incorrectChars, duration]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (gameState === 'finished') return;
    if (gameState === 'waiting') setGameState('running');
    
    if(value.endsWith(' ')) { // Word completed
        const currentWord = words[currentWordIndex];
        const typedWord = value.trim();

        for(let i=0; i < typedWord.length; i++) {
            if(typedWord[i] === currentWord[i]) {
                setCorrectChars(prev => prev + 1);
            } else {
                setIncorrectChars(prev => prev + 1);
            }
        }
        if(typedWord.length < currentWord.length) {
            setIncorrectChars(prev => prev + (currentWord.length - typedWord.length));
        }
        
        setCorrectChars(prev => prev + 1); // for the space
        
        setCurrentWordIndex(prev => prev + 1);
        setInputValue('');
    } else {
        setInputValue(value);
    }
  };

  const renderWords = () => {
    return words.map((word, index) => {
        let className = 'text-muted-foreground';
        if (index < currentWordIndex) {
            className = 'text-foreground'; // Correctly typed words
        } else if (index === currentWordIndex) {
             className = 'text-primary underline decoration-2 underline-offset-4'; // Current word
        }

      return <span key={index} className={cn('mr-2', className)}>{word}</span>;
    });
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Test Your Typing Speed</CardTitle>
        <CardDescription>Select your settings and start typing when you're ready.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center rounded-lg border p-4">
            <div>
                <Label className="text-sm font-medium">Difficulty</Label>
                <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="easy" onClick={startTest}>Easy</TabsTrigger>
                        <TabsTrigger value="medium" onClick={startTest}>Medium</TabsTrigger>
                        <TabsTrigger value="hard" onClick={startTest}>Hard</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
             <div>
                <Label className="text-sm font-medium">Duration</Label>
                 <Tabs value={duration} onValueChange={(v) => setDuration(v as Duration)} className="w-full sm:w-auto">
                    <TabsList>
                        {Object.entries(durations).map(([key, value]) => (
                            <TabsTrigger key={key} value={key} onClick={startTest}>{value}s</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </div>

        <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                {timeLeft}
            </div>
            <div className="rounded-md border bg-muted p-4 text-2xl font-mono leading-relaxed tracking-wider h-32 overflow-hidden">
             {renderWords()}
            </div>
        </div>
         <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 px-4 text-lg bg-background border rounded-md font-mono"
            value={inputValue}
            onChange={handleInputChange}
            disabled={gameState === 'finished'}
            placeholder={gameState === 'waiting' ? "Start typing to begin..." : ""}
          />
        </div>
        <Button onClick={startTest} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
        </Button>
      </CardContent>
       {gameState === 'finished' && (
            <CardFooter>
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                     <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">WPM</p>
                        <p className="text-3xl font-bold">{wpm.toFixed(0)}</p>
                    </div>
                     <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-3xl font-bold">{accuracy.toFixed(1)}%</p>
                    </div>
                     <div className="rounded-lg bg-muted p-4 col-span-2 md:col-span-1">
                        <p className="text-sm text-muted-foreground">Correct Chars</p>
                        <p className="text-3xl font-bold text-green-600">{correctChars}</p>
                    </div>
                </div>
            </CardFooter>
       )}
    </Card>
  );
}
