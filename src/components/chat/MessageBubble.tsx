import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Message, formatMessageTime, users, currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, isOwnMessage, showAvatar = true }: MessageBubbleProps) {
  const sender = isOwnMessage ? currentUser : users.find(u => u.id === message.senderId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'flex gap-2 max-w-[75%] group',
        isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <img
          src={sender?.avatar}
          alt={sender?.name}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-auto"
        />
      )}
      {!showAvatar && !isOwnMessage && <div className="w-8 flex-shrink-0" />}

      <div className={cn('flex flex-col', isOwnMessage ? 'items-end' : 'items-start')}>
        {/* Message Content */}
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl relative',
            isOwnMessage
              ? 'bg-message-own text-primary-foreground rounded-br-md'
              : 'bg-message-other text-card-foreground rounded-bl-md'
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-xs hover:bg-surface-3 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">{reaction.count}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Timestamp & Read Status */}
        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[11px] text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            message.isRead ? (
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Check className="w-3.5 h-3.5 text-muted-foreground" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
