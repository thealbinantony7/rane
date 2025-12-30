import { motion, Transition } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const transition: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={transition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
