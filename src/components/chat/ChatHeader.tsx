import { motion } from 'framer-motion';
import { Phone, Video, Search, MoreVertical, Hash, Users, Pin, Bell, BellOff } from 'lucide-react';
import { Conversation, users } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  conversation: Conversation;
  onToggleInfo: () => void;
}

export function ChatHeader({ conversation, onToggleInfo }: ChatHeaderProps) {
  const participant = conversation.participants[0];
  const isOnline = participant?.status === 'online';

  const getStatusText = () => {
    if (conversation.type === 'group') {
      return `${conversation.participants.length} members`;
    }
    if (conversation.type === 'channel') {
      return `${conversation.participants.length} subscribers`;
    }
    if (participant?.status === 'online') return 'Online';
    if (participant?.lastSeen) return `Last seen ${participant.lastSeen}`;
    return 'Offline';
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 px-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-xl"
    >
      <motion.button
        whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
        onClick={onToggleInfo}
        className="flex items-center gap-3 py-2 px-3 -ml-3 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="relative">
          {conversation.type === 'channel' ? (
            <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center">
              <Hash className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : conversation.type === 'group' ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <img
              src={participant?.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          
          {conversation.type === 'direct' && (
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                isOnline ? 'bg-status-online' : 'bg-muted'
              )}
            />
          )}
        </div>

        {/* Info */}
        <div className="text-left">
          <h2 className="font-semibold text-foreground">{conversation.name}</h2>
          <p className={cn(
            'text-xs',
            isOnline ? 'text-status-online' : 'text-muted-foreground'
          )}>
            {getStatusText()}
          </p>
        </div>
      </motion.button>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          title="Search in conversation"
        >
          <Search className="w-5 h-5" />
        </motion.button>
        
        {conversation.type === 'direct' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              title="Voice call"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              title="Video call"
            >
              <Video className="w-5 h-5" />
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
