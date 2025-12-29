import { useState, useRef, KeyboardEvent, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Paperclip, Mic, Send, Image, Timer, File, Camera, MapPin, Contact, Music, Plus, X } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string, options?: { selfDestruct?: number }) => void;
  onStartVoiceRecording: () => void;
  onOpenMediaUpload: () => void;
  selfDestructTimer: number | null;
  onOpenTimerSettings: () => void;
}

export const MessageInput = memo(function MessageInput({
  onSendMessage,
  onStartVoiceRecording,
  onOpenMediaUpload,
  selfDestructTimer,
  onOpenTimerSettings
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const attachOptions = [
    { icon: Image, label: 'Photo', color: 'hsl(220 100% 60%)' },
    { icon: Camera, label: 'Camera', color: 'hsl(340 80% 55%)' },
    { icon: File, label: 'File', color: 'hsl(45 100% 50%)' },
    { icon: MapPin, label: 'Location', color: 'hsl(142 70% 45%)' },
    { icon: Contact, label: 'Contact', color: 'hsl(280 80% 60%)' },
    { icon: Music, label: 'Audio', color: 'hsl(0 70% 55%)' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), selfDestructTimer ? { selfDestruct: selfDestructTimer } : undefined);
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
    setShowEmojiPicker(false);
  };

  const handleAttachOption = (label: string) => {
    setShowAttachMenu(false);
    if (label === 'Photo' || label === 'File') {
      onOpenMediaUpload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-2 md:p-4 border-t border-border/30 glass-subtle relative"
    >
      {/* Self-destruct indicator */}
      <AnimatePresence>
        {selfDestructTimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 mb-2 md:mb-3 bg-destructive/10 rounded-xl text-xs md:text-sm text-destructive border border-destructive/20"
          >
            <Timer className="w-4 h-4" />
            <span>Messages will self-destruct after {selfDestructTimer}s</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telegram-style Attach Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAttachMenu(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bottom-full left-2 mb-2 p-3 glass-panel rounded-2xl z-50 grid grid-cols-3 gap-2"
            >
              {attachOptions.map((option, index) => (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAttachOption(option.label)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-surface-2/80 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <option.icon className="w-6 h-6" style={{ color: option.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={cn(
        'flex items-end gap-1 md:gap-2 p-1.5 md:p-2.5 rounded-2xl bg-surface-2/60 border border-border/20 transition-all duration-300',
        isFocused && 'border-foreground/20 shadow-glass bg-surface-2/80'
      )}>
        {/* Attach Button - Telegram style plus icon */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={cn(
            'p-2 rounded-xl transition-colors',
            showAttachMenu 
              ? 'bg-foreground text-background' 
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-3'
          )}
        >
          {showAttachMenu ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.button>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground py-2 px-1 md:px-2 max-h-[150px] text-sm md:text-[15px] leading-relaxed"
        />

        {/* Right side actions */}
        <div className="flex items-center gap-0.5 pb-0.5">
          {/* Emoji Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </motion.button>
            <EmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onSelect={handleEmojiSelect}
              position="top"
            />
          </div>

          {/* Timer Button - Desktop only */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenTimerSettings}
            className={cn(
              'p-2 rounded-lg transition-colors hidden md:block',
              selfDestructTimer 
                ? 'text-destructive bg-destructive/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-3'
            )}
          >
            <Timer className="w-5 h-5" />
          </motion.button>

          {/* Send / Voice Button */}
          <AnimatePresence mode="wait">
            {message.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="p-2.5 rounded-xl bg-foreground text-background transition-colors liquid-button"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartVoiceRecording}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hint - hidden on mobile */}
      <p className="hidden md:block text-[10px] text-muted-foreground/50 mt-2 text-center">
        Press <kbd className="px-1 py-0.5 rounded bg-surface-3/50 font-mono text-[9px]">Enter</kbd> to send
      </p>
    </motion.div>
  );
});
