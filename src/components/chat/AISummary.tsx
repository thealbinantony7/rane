import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  created_at: string;
}

interface AISummaryProps {
  isOpen: boolean;
  onClose: () => void;
  conversationName: string;
  messages?: Message[];
}

export function AISummary({ isOpen, onClose, conversationName, messages = [] }: AISummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setSummary('');
      
      const generateSummary = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('ai-summary', {
            body: { 
              messages: messages.map(m => ({
                sender_name: m.sender_name || 'User',
                content: m.content,
                created_at: m.created_at
              })),
              conversationName 
            }
          });

          if (error) {
            throw error;
          }

          if (data?.error) {
            toast.error(data.error);
            setSummary('Unable to generate summary. Please try again later.');
          } else {
            setSummary(data?.summary || 'No summary available.');
          }
        } catch (error) {
          console.error('Error generating summary:', error);
          toast.error('Failed to generate AI summary');
          setSummary('Unable to generate summary. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      generateSummary();
    }
  }, [isOpen, messages, conversationName]);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-apple-xl z-50 overflow-hidden vibrancy"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-apple-sm">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">AI Summary</h3>
                  <p className="text-sm text-muted-foreground">{conversationName}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[400px] overflow-y-auto scrollbar-thin">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="mt-4 text-muted-foreground">Analyzing conversation...</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    This may take a few seconds
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-sm dark:prose-invert max-w-none"
                >
                  {summary.split('\n').map((line, index) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h4 key={index} className="font-semibold text-foreground mt-4 first:mt-0 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('•')) {
                      return (
                        <p key={index} className="text-foreground/80 ml-2 mb-1">
                          {line}
                        </p>
                      );
                    }
                    if (line.match(/^\d+\./)) {
                      return (
                        <p key={index} className="text-foreground/80 ml-2 mb-1">
                          {line}
                        </p>
                      );
                    }
                    return line ? <p key={index} className="text-foreground/80 mb-2">{line}</p> : null;
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {!isLoading && (
              <div className="flex items-center justify-between p-5 border-t border-border/50 bg-surface-1/50">
                <p className="text-xs text-muted-foreground">
                  Generated by Rane AI
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 shadow-apple-sm press-effect"
                >
                  Done
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
