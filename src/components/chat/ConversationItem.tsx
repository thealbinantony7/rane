import { motion } from 'framer-motion';
import { Pin, VolumeX, Hash, Users } from 'lucide-react';
import { Conversation, formatTimestamp, currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const participant = conversation.participants[0];
  const isFromMe = conversation.lastMessage?.senderId === currentUser.id;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
        isActive && 'bg-surface-2'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {conversation.type === 'channel' ? (
          <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center">
            <Hash className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : conversation.type === 'group' ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <img
            src={participant?.avatar}
            alt={conversation.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        
        {/* Status indicator for direct messages */}
        {conversation.type === 'direct' && participant && (
          <span
            className={cn(
              'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card',
              participant.status === 'online' && 'bg-status-online',
              participant.status === 'away' && 'bg-status-away',
              participant.status === 'offline' && 'bg-muted'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-medium truncate',
            conversation.unreadCount > 0 && 'text-foreground',
            conversation.unreadCount === 0 && 'text-foreground/90'
          )}>
            {conversation.name}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {conversation.isPinned && (
              <Pin className="w-3 h-3 text-muted-foreground" />
            )}
            {conversation.isMuted && (
              <VolumeX className="w-3 h-3 text-muted-foreground" />
            )}
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(conversation.lastMessage.timestamp)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm truncate',
            conversation.unreadCount > 0 ? 'text-foreground/80' : 'text-muted-foreground'
          )}>
            {isFromMe && <span className="text-muted-foreground">You: </span>}
            {conversation.lastMessage?.content}
          </p>
          
          {conversation.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
