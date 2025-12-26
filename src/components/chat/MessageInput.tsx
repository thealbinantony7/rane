import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Smile, Paperclip, Mic, Send, Image as ImageIcon, AtSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const actionButtons = [
    { icon: Smile, label: 'Emoji' },
    { icon: AtSign, label: 'Mention' },
    { icon: ImageIcon, label: 'Image' },
    { icon: Paperclip, label: 'Attach' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-t border-border bg-card/50 backdrop-blur-xl"
    >
      <div
        className={cn(
          'flex items-end gap-2 p-2 rounded-2xl bg-surface-2 border border-transparent transition-all duration-200',
          isFocused && 'border-primary/30 glow-sm'
        )}
      >
        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 pb-1">
          {actionButtons.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
              title={label}
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground py-2 px-2 max-h-[150px] text-[15px] leading-relaxed"
        />

        {/* Send / Voice Button */}
        <div className="flex items-center gap-1 pb-1">
          {message.trim() ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
              title="Voice message"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground/60 mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[10px]">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[10px]">Shift + Enter</kbd> for new line
      </p>
    </motion.div>
  );
}
