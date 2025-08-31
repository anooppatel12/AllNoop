
'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Percent, Divide, FileText, MessageSquare } from 'lucide-react';
import React from 'react';

const icons = [
  { icon: Plus, size: 'w-8 h-8', top: '10%', left: '15%', duration: 10 },
  { icon: Minus, size: 'w-6 h-6', top: '20%', left: '80%', duration: 12 },
  { icon: Percent, size: 'w-10 h-10', top: '50%', left: '5%', duration: 15 },
  { icon: Divide, size: 'w-5 h-5', top: '80%', left: '20%', duration: 8 },
  { icon: FileText, size: 'w-8 h-8', top: '15%', left: '90%', duration: 11 },
  { icon: MessageSquare, size: 'w-7 h-7', top: '70%', left: '75%', duration: 14 },
  { icon: Plus, size: 'w-4 h-4', top: '90%', left: '50%', duration: 9 },
  { icon: FileText, size: 'w-6 h-6', top: '40%', left: '30%', duration: 13 },
];

export function FloatingElements() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-muted-foreground/30 cursor-pointer"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: ['-10px', '10px', '-10px'],
            x: ['-5px', '5px', '-5px'],
            rotate: [0, 10, -10, 0],
          }}
          whileHover={{ 
            scale: 1.5,
            color: 'hsl(var(--primary))'
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        >
          <item.icon className={item.size} />
        </motion.div>
      ))}
    </div>
  );
}
