import { memo } from 'react';
import { motion } from 'framer-motion';

export const MeshBackground = memo(function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Animated mesh gradient orbs - Phase 2: Deep mesh with high blur */}
      <motion.div
        className="absolute -top-1/3 -left-1/3 w-2/3 h-2/3 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(0 0% 12%) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 80, 40, 0],
          y: [0, 40, 80, 0],
          scale: [1, 1.15, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute -bottom-1/3 -right-1/3 w-3/4 h-3/4 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(0 0% 10%) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -60, -30, 0],
          y: [0, -40, -80, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-1/3 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(0 0% 15%) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 60, 30, 0],
          scale: [1, 1.25, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 8px grid overlay for alignment reference (very subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: 'linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />
    </div>
  );
});
