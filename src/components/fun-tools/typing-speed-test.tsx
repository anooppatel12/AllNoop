
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Learning to type quickly and accurately is a valuable skill in today's digital world. Practice makes perfect, so keep trying to improve your words per minute.",
  "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, innovation continues to shape our future. The internet connects billions of people, providing access to information and opportunities like never before. It's a vast digital landscape.",
  "Never underestimate the power of a good book. Reading transports you to different worlds, introduces you to fascinating characters, and expands your vocabulary. Whether it's fiction, non-fiction, or poetry, literature offers endless possibilities for learning and entertainment.",
  "The sun is a star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process. It is by far the most important source of energy for life on Earth."
];

export function TypingSpeedTest() {
  const [text, setText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startTest = () => {
    const newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(newText);
    setInputValue('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    if(inputRef.current) {
        inputRef.current.focus();
    }
  };

  useEffect(() => {
    startTest();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setInputValue(value);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = (correctChars / value.length) * 100 || 100;
    setAccuracy(currentAccuracy);
    
    // Calculate WPM
    if(startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = value.trim().split(/\s+/).length;
        const currentWpm = Math.round(wordsTyped / elapsedTime);
        setWpm(currentWpm);
    }
    
    if (value.length === text.length) {
      setIsFinished(true);
    }
  };
  
  const renderText = () => {
    return text.split('').map((char, index) => {
      let color = 'text-muted-foreground';
      if (index < inputValue.length) {
        color = char === inputValue[index] ? 'text-foreground' : 'text-destructive';
      }
      return <span key={index} className={color}>{char}</span>;
    });
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Test Your Typing Speed</CardTitle>
        <CardDescription>Type the text below as quickly and accurately as you can.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border bg-muted p-4 text-lg font-mono leading-relaxed tracking-wider">
          {renderText()}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full h-12 px-4 text-lg bg-background border rounded-md"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder="Start typing here..."
          />
        </div>
        <Button onClick={startTest} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
        </Button>
      </CardContent>
       {(startTime || isFinished) && (
            <CardFooter>
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                     <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="text-2xl font-bold">{startTime ? Math.round((Date.now() - startTime)/1000) : 0}s</p>
                    </div>
                     <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">WPM</p>
                        <p className="text-2xl font-bold">{wpm}</p>
                    </div>
                     <div className="rounded-lg bg-muted p-4 col-span-2 md:col-span-1">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{accuracy.toFixed(1)}%</p>
                    </div>
                </div>
            </CardFooter>
       )}
    </Card>
  );
}
