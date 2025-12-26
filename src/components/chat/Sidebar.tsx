import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Settings, Filter } from 'lucide-react';
import { conversations, Conversation } from '@/lib/mockData';
import { ConversationItem } from './ConversationItem';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenCommandPalette: () => void;
}

type FilterType = 'all' | 'unread' | 'groups' | 'channels';

export function Sidebar({ activeConversation, onSelectConversation, onOpenCommandPalette }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && conv.unreadCount > 0) ||
      (filter === 'groups' && conv.type === 'group') ||
      (filter === 'channels' && conv.type === 'channel');
    return matchesSearch && matchesFilter;
  });

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const otherConversations = filteredConversations.filter(c => !c.isPinned);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'groups', label: 'Groups' },
    { key: 'channels', label: 'Channels' },
  ];

  return (
    <div className="w-80 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gradient">Messages</h1>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
            >
              <Edit className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-surface-2 rounded-lg text-muted-foreground hover:bg-surface-3 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm flex-1 text-left">Search messages...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </motion.button>

        {/* Filters */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto scrollbar-thin pb-1">
          {filters.map(({ key, label }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                filter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface-2 text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {pinnedConversations.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
              Pinned
            </p>
            {pinnedConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConversationItem
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => onSelectConversation(conv)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {otherConversations.length > 0 && (
          <div>
            {pinnedConversations.length > 0 && (
              <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                Recent
              </p>
            )}
            {otherConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (pinnedConversations.length + index) * 0.05 }}
              >
                <ConversationItem
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => onSelectConversation(conv)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
