import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Filter, Plus } from 'lucide-react';
import { Conversation } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { RaneLogo } from '@/components/RaneLogo';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onNewConversation: () => void;
  loading: boolean;
}

type FilterType = 'all' | 'unread' | 'groups' | 'channels';

export function Sidebar({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  onOpenCommandPalette,
  onOpenSettings,
  onNewConversation,
  loading,
}: SidebarProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const { user } = useAuth();

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'all') return true;
    if (filter === 'unread') return (conv.unread_count || 0) > 0;
    if (filter === 'groups') return conv.type === 'group';
    if (filter === 'channels') return conv.type === 'channel';
    return true;
  });

  const pinnedConversations = filteredConversations.filter(c => c.is_pinned);
  const otherConversations = filteredConversations.filter(c => !c.is_pinned);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'groups', label: 'Groups' },
    { key: 'channels', label: 'Channels' },
  ];

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    if (conv.type === 'direct' && conv.members) {
      const otherMember = conv.members.find(m => m.user_id !== user?.id);
      return otherMember?.profile?.display_name || otherMember?.profile?.username || 'Unknown';
    }
    return 'Unnamed';
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.avatar_url) return conv.avatar_url;
    if (conv.type === 'direct' && conv.members) {
      const otherMember = conv.members.find(m => m.user_id !== user?.id);
      return otherMember?.profile?.avatar_url;
    }
    return null;
  };

  const getOtherMemberStatus = (conv: Conversation) => {
    if (conv.type === 'direct' && conv.members) {
      const otherMember = conv.members.find(m => m.user_id !== user?.id);
      return otherMember?.profile?.status || 'offline';
    }
    return null;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-80 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <RaneLogo size="sm" />
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewConversation}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
              title="New conversation"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSettings}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
              title="Settings"
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {pinnedConversations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                  Pinned
                </p>
                {pinnedConversations.map((conv) => (
                  <ConversationItemComponent
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => onSelectConversation(conv)}
                    name={getConversationName(conv)}
                    avatar={getConversationAvatar(conv)}
                    status={getOtherMemberStatus(conv)}
                    formatTime={formatTime}
                    currentUserId={user?.id}
                  />
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
                {otherConversations.map((conv) => (
                  <ConversationItemComponent
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => onSelectConversation(conv)}
                    name={getConversationName(conv)}
                    avatar={getConversationAvatar(conv)}
                    status={getOtherMemberStatus(conv)}
                    formatTime={formatTime}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Filter className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
                </p>
                {conversations.length === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewConversation}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Start a conversation
                  </motion.button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  name: string;
  avatar: string | null | undefined;
  status: string | null;
  formatTime: (date: string) => string;
  currentUserId: string | undefined;
}

function ConversationItemComponent({ 
  conversation, 
  isActive, 
  onClick, 
  name, 
  avatar, 
  status,
  formatTime,
  currentUserId,
}: ConversationItemProps) {
  const isFromMe = conversation.last_message?.sender_id === currentUserId;

  return (
    <motion.button
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
          <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-muted-foreground font-semibold">
            #
          </div>
        ) : conversation.type === 'group' ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-primary font-semibold">{name.charAt(0)}</span>
          </div>
        ) : avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-muted-foreground font-semibold">
            {name.charAt(0)}
          </div>
        )}
        
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card',
              status === 'online' && 'bg-status-online',
              status === 'away' && 'bg-status-away',
              status === 'offline' && 'bg-muted'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-medium truncate',
            (conversation.unread_count || 0) > 0 ? 'text-foreground' : 'text-foreground/90'
          )}>
            {name}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {conversation.last_message && (
              <span className="text-xs text-muted-foreground">
                {formatTime(conversation.last_message.created_at)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm truncate',
            (conversation.unread_count || 0) > 0 ? 'text-foreground/80' : 'text-muted-foreground'
          )}>
            {isFromMe && <span className="text-muted-foreground">You: </span>}
            {conversation.last_message?.content || 'No messages yet'}
          </p>
          
          {(conversation.unread_count || 0) > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
