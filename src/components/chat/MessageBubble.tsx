import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Reply, Smile, Bookmark, MoreHorizontal, Timer, Mic, Play, Pause } from 'lucide-react';
import { Message, formatMessageTime, users, currentUser } from '@/lib/mockData';
import { MarkdownRenderer } from './MarkdownRenderer';
import { EmojiPicker } from './EmojiPicker';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  onReply?: (message: Message) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onBookmark?: (messageId: string) => void;
  replyToMessage?: Message;
}

export function MessageBubble({ 
  message, 
  isOwnMessage, 
  showAvatar = true,
  onReply,
  onReact,
  onBookmark,
  replyToMessage,
}: MessageBubbleProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sender = isOwnMessage ? currentUser : users.find(u => u.id === message.senderId);
  const replySender = replyToMessage 
    ? (replyToMessage.senderId === currentUser.id ? currentUser : users.find(u => u.id === replyToMessage.senderId))
    : null;

  const isVoiceMessage = message.content.startsWith('[Voice message');
  const hasMarkdown = message.content.includes('```') || message.content.includes('**') || message.content.includes('`');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'flex gap-1.5 md:gap-2 max-w-[85%] md:max-w-[75%] group relative',
        isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <img
          src={sender?.avatar}
          alt={sender?.name}
          className="w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 mt-auto"
        />
      )}
      {!showAvatar && !isOwnMessage && <div className="w-7 md:w-8 flex-shrink-0" />}

      <div className={cn('flex flex-col', isOwnMessage ? 'items-end' : 'items-start')}>
        {/* Reply reference */}
        {replyToMessage && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 mb-1 rounded-lg bg-surface-2/50 text-xs',
            isOwnMessage ? 'mr-2' : 'ml-2'
          )}>
            <Reply className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium">{replySender?.name}</span>
            <span className="text-muted-foreground truncate max-w-[150px]">
              {replyToMessage.content}
            </span>
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            'px-3 py-2 md:px-4 md:py-2.5 rounded-2xl relative',
            isOwnMessage
              ? 'bg-message-own text-primary-foreground rounded-br-md'
              : 'bg-message-other text-card-foreground rounded-bl-md'
          )}
        >
          {/* Self-destruct indicator */}
          {message.selfDestruct && (
            <div className="flex items-center gap-1 text-xs text-destructive/70 mb-1">
              <Timer className="w-3 h-3" />
              <span>Self-destructs in {message.selfDestruct}s</span>
            </div>
          )}

          {/* Voice message */}
          {isVoiceMessage ? (
            <div className="flex items-center gap-3 min-w-[200px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  'p-2 rounded-full',
                  isOwnMessage ? 'bg-primary-foreground/20' : 'bg-primary/20'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </motion.button>
              <div className="flex-1 flex items-center gap-1 h-6">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 rounded-full',
                      isOwnMessage ? 'bg-primary-foreground/40' : 'bg-primary/40'
                    )}
                    style={{ height: `${Math.random() * 100}%`, minHeight: 4 }}
                  />
                ))}
              </div>
              <span className="text-xs opacity-70">
                {message.content.match(/\d+:\d+/)?.[0] || '0:00'}
              </span>
            </div>
          ) : hasMarkdown ? (
            <div className="text-sm md:text-[15px] leading-relaxed">
              <MarkdownRenderer content={message.content} />
            </div>
          ) : (
            <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Bookmark indicator */}
          {message.isBookmarked && (
            <Bookmark className="absolute -top-1 -right-1 w-4 h-4 text-primary fill-primary" />
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-xs hover:bg-surface-3 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">{reaction.count}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Timestamp & Read Status - always visible on mobile */}
        <div className="flex items-center gap-1 mt-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] md:text-[11px] text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            message.isRead ? (
              <CheckCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
            ) : (
              <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
            )
          )}
        </div>
      </div>

      {/* Action buttons - only on desktop */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              'absolute top-0 hidden md:flex items-center gap-0.5 p-1 bg-card rounded-lg border border-border shadow-lg',
              isOwnMessage ? 'right-full mr-2' : 'left-full ml-2'
            )}
          >
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                title="React"
              >
                <Smile className="w-4 h-4" />
              </motion.button>
              <EmojiPicker
                isOpen={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
                onSelect={(emoji) => onReact?.(message.id, emoji)}
                position="bottom"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onReply?.(message)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onBookmark?.(message.id)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                message.isBookmarked 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
              )}
              title="Bookmark"
            >
              <Bookmark className={cn('w-4 h-4', message.isBookmarked && 'fill-primary')} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
