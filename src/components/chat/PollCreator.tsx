import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BarChart3, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (poll: { question: string; options: string[]; multiSelect: boolean }) => void;
}

export function PollCreator({ isOpen, onClose, onCreatePoll }: PollCreatorProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [multiSelect, setMultiSelect] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    const validOptions = options.filter(o => o.trim());
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll({ question: question.trim(), options: validOptions, multiSelect });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setMultiSelect(false);
  };

  const canCreate = question.trim() && options.filter(o => o.trim()).length >= 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Create Poll</h3>
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

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {/* Question */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask something..."
                  className="w-full px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Options */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Options</label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                      />
                      {options.length > 2 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeOption(index)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {options.length < 10 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addOption}
                    className="flex items-center gap-2 mt-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add option
                  </motion.button>
                )}
              </div>

              {/* Multi-select toggle */}
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Multiple answers</p>
                  <p className="text-sm text-muted-foreground">Allow selecting multiple options</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMultiSelect(!multiSelect)}
                  className={cn(
                    'w-12 h-7 rounded-full p-1 transition-colors',
                    multiSelect ? 'bg-primary' : 'bg-surface-3'
                  )}
                >
                  <motion.div
                    animate={{ x: multiSelect ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </motion.button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-surface-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={!canCreate}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  canCreate
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <BarChart3 className="w-4 h-4" />
                Create Poll
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface PollDisplayProps {
  question: string;
  options: { text: string; votes: number; voters?: string[] }[];
  totalVotes: number;
  multiSelect: boolean;
  hasVoted: boolean;
  onVote: (optionIndex: number) => void;
}

export function PollDisplay({ question, options, totalVotes, multiSelect, hasVoted, onVote }: PollDisplayProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (hasVoted) return;
    
    if (multiSelect) {
      setSelectedOptions(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
      onVote(index);
    }
  };

  return (
    <div className="p-4 bg-surface-2 rounded-xl max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-primary uppercase tracking-wider">Poll</span>
      </div>
      
      <h4 className="font-medium text-foreground mb-3">{question}</h4>
      
      <div className="space-y-2">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isSelected = selectedOptions.includes(index);
          
          return (
            <motion.button
              key={index}
              whileHover={!hasVoted ? { scale: 1.01 } : {}}
              whileTap={!hasVoted ? { scale: 0.99 } : {}}
              onClick={() => handleOptionClick(index)}
              disabled={hasVoted && !multiSelect}
              className={cn(
                'w-full p-3 rounded-lg text-left relative overflow-hidden transition-colors',
                hasVoted ? 'cursor-default' : 'hover:bg-surface-3 cursor-pointer',
                isSelected && 'ring-2 ring-primary'
              )}
            >
              {/* Progress bar (shown after voting) */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-y-0 left-0 bg-primary/20"
                />
              )}
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-foreground">{option.text}</span>
                </div>
                {hasVoted && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.round(percentage)}%
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mt-3">
        {totalVotes} vote{totalVotes !== 1 ? 's' : ''} • {multiSelect ? 'Multiple choice' : 'Single choice'}
      </p>
    </div>
  );
}
