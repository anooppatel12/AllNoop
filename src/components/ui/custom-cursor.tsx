'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });

    const target = e.target as HTMLElement;
    const computedStyle = window.getComputedStyle(target);
    const isInteractive = computedStyle.getPropertyValue('cursor') === 'pointer';
    setIsPointer(isInteractive);
    
    const closestElement = target.closest('p, h1, h2, h3, h4, h5, h6, span, label, button > span');
    setIsHoveringText(!!closestElement && !isInteractive);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [])

  const cursorVariants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: 'hsla(var(--primary) / 0.1)',
      border: '2px solid hsl(var(--primary))',
      boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))',
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
    pointer: {
      height: 48,
      width: 48,
      backgroundColor: 'hsla(var(--primary) / 0.2)',
      border: '2px solid hsl(var(--primary))',
      boxShadow: '0 0 15px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
     text: {
      height: 40,
      width: 4,
      borderRadius: '2px',
      backgroundColor: 'hsl(var(--primary))',
      border: '0px solid hsl(var(--primary))',
      boxShadow: '0 0 10px hsl(var(--primary))',
      transition: { type: 'spring', stiffness: 800, damping: 30 },
    }
  };
  
  const getVariant = () => {
      if (isHoveringText) return 'text';
      if (isPointer) return 'pointer';
      return 'default';
  }

  return (
    <div className="hidden md:block">
      <motion.div
        className="custom-cursor-dot"
        style={{ left: position.x, top: position.y }}
        animate={{
            scale: isPointer ? 1.5 : 1,
            backgroundColor: isPointer ? 'hsla(var(--primary) / 0.5)' : 'hsl(var(--primary))'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        hidden={!isVisible}
      />
      <motion.div
        className="custom-cursor-outline"
        style={{ left: position.x, top: position.y }}
        variants={cursorVariants}
        animate={getVariant()}
        hidden={!isVisible}
      />
    </div>
  );
}
