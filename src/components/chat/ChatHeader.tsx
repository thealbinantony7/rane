import { motion } from 'framer-motion';
import { Phone, Video, Search, MoreVertical, Hash, Users, Pin, Bell, BellOff, Menu } from 'lucide-react';
import { Conversation, users } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  conversation: Conversation;
  onToggleInfo: () => void;
  onOpenMobileSidebar?: () => void;
}

export function ChatHeader({ conversation, onToggleInfo, onOpenMobileSidebar }: ChatHeaderProps) {
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
      className="h-14 md:h-16 px-3 md:px-5 border-b border-border/30 flex items-center justify-between liquid-glass"
    >
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ backgroundColor: 'hsl(var(--surface-2) / 0.8)' }}
          onClick={onToggleInfo}
          className="flex items-center gap-2 md:gap-3 py-2 px-2 md:px-3 rounded-xl transition-all duration-200"
        >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {conversation.type === 'channel' ? (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-3 flex items-center justify-center">
              <Hash className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
          ) : conversation.type === 'group' ? (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
          ) : (
            <img
              src={participant?.avatar}
              alt={conversation.name}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
            />
          )}
          
          {conversation.type === 'direct' && (
            <span
              className={cn(
                'absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-card',
                isOnline ? 'bg-status-online' : 'bg-muted'
              )}
            />
          )}
        </div>

        {/* Info */}
        <div className="text-left min-w-0">
          <h2 className="font-semibold text-foreground text-sm md:text-base truncate max-w-[120px] md:max-w-none">{conversation.name}</h2>
          <p className={cn(
            'text-xs truncate',
            isOnline ? 'text-status-online' : 'text-muted-foreground'
          )}>
            {getStatusText()}
          </p>
        </div>
        </motion.button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 md:gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors hidden md:block"
          title="Search in conversation"
        >
          <Search className="w-5 h-5" />
        </motion.button>
        
        {conversation.type === 'direct' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              title="Voice call"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              title="Video call"
            >
              <Video className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          title="More options"
        >
          <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
