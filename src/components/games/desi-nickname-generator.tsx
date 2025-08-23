
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';


const titles = [
    'King', 'Queen', 'Boss', 'Don', 'Baba', 'Rani', 'Bhai', 'Didi', 'Master', 
    'Sultan', 'Shehzada', 'Shehzadi', 'Maharaja', 'Maharani', 'Nawab'
];

const colors = [
    'text-red-500', 'text-orange-500', 'text-amber-500', 'text-yellow-500', 
    'text-lime-500', 'text-green-500', 'text-emerald-500', 'text-teal-500', 
    'text-cyan-500', 'text-sky-500', 'text-blue-500', 'text-indigo-500', 
    'text-violet-500', 'text-purple-500', 'text-fuchsia-500', 'text-pink-500', 'text-rose-500'
];

export function DesiNicknameGenerator() {
    const [nameLetter, setNameLetter] = useState('');
    const [food, setFood] = useState('');
    const [mood, setMood] = useState('');
    const [nickname, setNickname] = useState('');
    
    const randomColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [nickname]);

    const generateNickname = () => {
        if (!food) {
            setNickname('Enter a food!');
            return;
        }
        
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const capitalizedFood = food.charAt(0).toUpperCase() + food.slice(1).toLowerCase();

        setNickname(`${capitalizedFood} ${randomTitle}`);
    };
    
    const tryAgain = () => {
        setNameLetter('');
        setFood('');
        setMood('');
        setNickname('');
    };

    return (
        <Card className="mt-8 mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-center">What's Your Desi Nickname?</CardTitle>
            <CardDescription className="text-center">Fill in the details below!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {nickname ? (
                <div className="text-center min-h-[220px] flex flex-col justify-center items-center">
                    <p className="text-muted-foreground">Your awesome desi nickname is...</p>
                    <AnimatePresence>
                        <motion.h2 
                            key={nickname}
                            initial={{ opacity: 0, y: 50, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                            className={cn(
                                "text-5xl font-extrabold tracking-tight my-4 font-headline",
                                randomColor
                            )}
                            style={{
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            {nickname}
                        </motion.h2>
                    </AnimatePresence>
                    <Button onClick={tryAgain}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
             ) : (
                <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name-letter">First letter of your name</Label>
                        <Input
                        id="name-letter"
                        value={nameLetter}
                        onChange={(e) => setNameLetter(e.target.value)}
                        maxLength={1}
                        placeholder="e.g., A"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="food">Your favourite food</Label>
                        <Input
                        id="food"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        placeholder="e.g., Samosa"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mood">Your current mood</Label>
                        <Input
                        id="mood"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="e.g., Happy"
                        />
                    </div>
                    <Button onClick={generateNickname} className="w-full">
                        Generate Nickname
                    </Button>
                </div>
             )}
          </CardContent>
        </Card>
    );
}

