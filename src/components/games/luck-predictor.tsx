
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fortunes = [
  "Kal tumhara ex message karega 📱",
  "Aaj tumhare crush tumhe notice karenge 👀",
  "Tum rich banoge… bas Monopoly game me 😅",
  "Pizza delivery wala tumhe ‘Bhaiya’ bulayega 🍕😂",
  "Tumhare socks ki jodi mil jayegi 🧦✨",
  "You will find money in your old jeans 👖",
  "Someone will share their Netflix password with you 🍿",
  "Your biryani will have an extra piece of chicken 🍗",
  "The street dog you pet will remember you forever 🐶❤️",
  "You will successfully avoid a family function 🕺",
  "Your phone battery will last the whole day 🔋",
  "Traffic will magically clear for you 🚗💨",
  "You will get free dhaniya from sabziwala 🌿"
];

export function LuckPredictor() {
    const [prediction, setPrediction] = useState("Click the button to see your luck!");

    const predictLuck = () => {
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        setPrediction(fortunes[randomIndex]);
    };

    return (
        <Card className="mt-8 mx-auto max-w-md text-center">
          <CardHeader>
            <CardTitle>What's your fortune?</CardTitle>
            <CardDescription>Let the dice decide your fate for today!</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[150px] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
                 <motion.p 
                    key={prediction}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-semibold text-primary"
                >
                    {prediction}
                </motion.p>
            </AnimatePresence>
          </CardContent>
           <CardContent>
             <Button onClick={predictLuck} size="lg" className="w-full text-lg">
                Predict My Luck <Dices className="ml-2 h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
    );
}
