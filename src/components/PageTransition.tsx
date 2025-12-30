import { motion, Transition } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const transition: Transition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
