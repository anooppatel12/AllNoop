
'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, FileText, Hash, ImageIcon, MessageSquare, Users, VenetianMask, Keyboard, Quote, Gamepad2, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { FloatingElements } from '@/components/floating-elements';

const features = [
  { name: 'AI Hashtag Generator', icon: Hash, href: '/hashtag-generator' },
  { name: 'Calculators', icon: Calculator, href: '/calculators' },
  { name: 'PDF Tools', icon: FileText, href: '/pdf-tools' },
  { name: 'Image Editor', icon: ImageIcon, href: '/image-editor' },
  { name: 'Meme Generator', icon: VenetianMask, href: '/fun-tools/meme-generator' },
  { name: 'Typing Speed Test', icon: Keyboard, href: '/fun-tools/typing-speed-test' },
  { name: 'Joke & Quote Generator', icon: Quote, href: '/fun-tools/random-joke-quote-generator' },
  { name: 'Games', icon: Gamepad2, href: '/games' },
  { name: 'P2P Chat', icon: Users, href: '/chat' },
  { name: 'Contact', icon: MessageSquare, href: '/contact' },
  { name: 'Sudoku', icon: Puzzle, href: '/games/sudoku' },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <FloatingElements />
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="font-headline text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl"
        >
          Your All-in-One Digital Toolkit
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
        >
          From complex calculations to creative content generation, OmniTool provides the solutions you need in one unified platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Link href="/calculators">
            <button className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105">
              Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={feature.href} className="group block h-full">
                <div className="h-full rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-headline text-xl font-bold text-foreground">{feature.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
