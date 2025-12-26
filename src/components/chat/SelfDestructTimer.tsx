import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelfDestructTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (seconds: number | null) => void;
  currentTimer: number | null;
}

const timerOptions = [
  { label: 'Off', value: null },
  { label: '5 seconds', value: 5 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '1 hour', value: 3600 },
  { label: '24 hours', value: 86400 },
];

export function SelfDestructTimer({ isOpen, onClose, onSelect, currentTimer }: SelfDestructTimerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Timer className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Self-Destruct Timer</h3>
                  <p className="text-sm text-muted-foreground">Messages auto-delete after</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Options */}
            <div className="p-2">
              {timerOptions.map(option => (
                <motion.button
                  key={option.label}
                  whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                    currentTimer === option.value && 'bg-primary/10'
                  )}
                >
                  <Clock className={cn(
                    'w-5 h-5',
                    currentTimer === option.value ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    'flex-1',
                    currentTimer === option.value ? 'text-primary font-medium' : 'text-foreground'
                  )}>
                    {option.label}
                  </span>
                  {currentTimer === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Warning */}
            <div className="px-4 pb-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-xs text-destructive">
                  Messages will be permanently deleted from all devices after the timer expires.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
