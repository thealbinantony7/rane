import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Paperclip, Mic, Send, Image as ImageIcon, Timer } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { cn } from '@/lib/utils';
interface MessageInputProps {
  onSendMessage: (content: string, options?: {
    selfDestruct?: number;
  }) => void;
  onStartVoiceRecording: () => void;
  onOpenMediaUpload: () => void;
  selfDestructTimer: number | null;
  onOpenTimerSettings: () => void;
}
export function MessageInput({
  onSendMessage,
  onStartVoiceRecording,
  onOpenMediaUpload,
  selfDestructTimer,
  onOpenTimerSettings
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatHint, setShowFormatHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), selfDestructTimer ? {
        selfDestruct: selfDestructTimer
      } : undefined);
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
  const insertMarkdown = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    let newText = '';
    let cursorOffset = 0;
    if (syntax === 'code') {
      if (selectedText.includes('\n')) {
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorOffset = 4;
      } else {
        newText = `\`${selectedText}\``;
        cursorOffset = 1;
      }
    } else if (syntax === 'bold') {
      newText = `**${selectedText}**`;
      cursorOffset = 2;
    }
    const updatedMessage = message.substring(0, start) + newText + message.substring(end);
    setMessage(updatedMessage);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + selectedText.length);
    }, 0);
  };
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="p-2 md:p-4 border-t border-border/30 liquid-glass relative">
      {/* Self-destruct indicator */}
      {selfDestructTimer && <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 mb-2 md:mb-3 bg-destructive/10 rounded-xl text-xs md:text-sm text-destructive border border-destructive/20">
          <Timer className="w-4 h-4" />
          <span>Messages will self-destruct after {selfDestructTimer}s</span>
        </div>}

      <div className={cn('flex items-end gap-1 md:gap-2 p-1.5 md:p-2.5 rounded-2xl bg-surface-2/60 border border-border/20 transition-all duration-300', isFocused && 'border-primary/30 shadow-glass bg-surface-2/80')}>
        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 pb-1">
          <div className="relative">
            <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 md:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors" title="Emoji">
              <Smile className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <EmojiPicker isOpen={showEmojiPicker} onClose={() => setShowEmojiPicker(false)} onSelect={handleEmojiSelect} position="top" />
          </div>
          
          

          <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} onClick={onOpenMediaUpload} className="p-1.5 md:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors" title="Attach files">
            <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} onClick={onOpenTimerSettings} className={cn('p-1.5 md:p-2 rounded-lg transition-colors hidden md:block', selfDestructTimer ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-foreground hover:bg-surface-3')} title="Self-destruct timer">
            <Timer className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Input */}
        <textarea ref={textareaRef} value={message} onChange={handleInput} onKeyDown={handleKeyDown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Type a message..." rows={1} className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground py-2 px-1 md:px-2 max-h-[150px] text-sm md:text-[15px] leading-relaxed" />

        {/* Send / Voice Button */}
        <div className="flex items-center gap-1 pb-1">
          {message.trim() ? <motion.button initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} onClick={handleSend} className="p-2 md:p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button> : <motion.button whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }} onClick={onStartVoiceRecording} className="p-1.5 md:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors" title="Voice message">
              <Mic className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>}
        </div>
      </div>

      {/* Hint - hidden on mobile */}
      <p className="hidden md:block text-xs text-muted-foreground/60 mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[10px]">Enter</kbd> to send • 
        Use <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[10px]">**bold**</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[10px]">`code`</kbd> for formatting
      </p>
    </motion.div>;
}