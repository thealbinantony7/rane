import { motion } from 'framer-motion';
import { X, Reply } from 'lucide-react';
import { Message, users, currentUser } from '@/lib/mockData';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export function ReplyPreview({ message, onCancel }: ReplyPreviewProps) {
  const sender = message.senderId === currentUser.id 
    ? currentUser 
    : users.find(u => u.id === message.senderId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      className="px-4 pt-3 bg-card/50 border-t border-border"
    >
      <div className="flex items-center gap-3 p-2 bg-surface-2 rounded-lg">
        <Reply className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0 border-l-2 border-primary pl-3">
          <p className="text-xs font-medium text-primary">{sender?.name || 'Unknown'}</p>
          <p className="text-sm text-muted-foreground truncate">{message.content}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
