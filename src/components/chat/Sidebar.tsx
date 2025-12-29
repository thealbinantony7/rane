import { useState, memo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, Settings, Plus, X, Home, MessageSquare, Users, Hash, User } from 'lucide-react';
import { Conversation } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LinkUpLogo } from '@/components/LinkUpLogo';
import { ProfileHub } from '@/components/ProfileHub';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onNewConversation: () => void;
  loading: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

type FilterType = 'all' | 'unread' | 'groups' | 'channels';

export const Sidebar = memo(function Sidebar({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  onOpenCommandPalette,
  onOpenSettings,
  onNewConversation,
  loading,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showProfileHub, setShowProfileHub] = useState(false);
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

  const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All', icon: Home },
    { key: 'unread', label: 'Unread', icon: MessageSquare },
    { key: 'groups', label: 'Groups', icon: Users },
    { key: 'channels', label: 'Channels', icon: Hash },
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

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation);
    onMobileClose?.();
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={cn(
          "h-full glass-panel flex flex-col z-50",
          "hidden md:flex md:w-80",
          isMobileOpen && "fixed inset-y-0 left-0 flex w-[85vw] max-w-[320px] md:relative md:w-80"
        )}
        initial={false}
        animate={isMobileOpen ? { x: 0 } : undefined}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <LinkUpLogo size="sm" />
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewConversation}
                className="p-2.5 rounded-lg hover:bg-surface-2 transition-all duration-200 magnetic-hover"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenSettings}
                className="p-2.5 rounded-lg hover:bg-surface-2 transition-all duration-200 magnetic-hover"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </motion.button>
              {/* Profile Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileHub(true)}
                className="p-2.5 rounded-lg hover:bg-surface-2 transition-all duration-200 magnetic-hover"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMobileClose}
                className="p-2.5 rounded-lg hover:bg-surface-2 transition-all duration-200 md:hidden"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-3 bg-surface-2/50 rounded-lg text-muted-foreground hover:bg-surface-2/80 transition-all duration-200 border border-border/30"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">Search</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-surface-3/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </motion.button>

          {/* Filter tabs with icons - Functional buttons */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto scrollbar-thin pb-1">
            {filters.map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  filter === key
                    ? 'bg-foreground text-background'
                    : 'bg-surface-2/40 text-muted-foreground hover:bg-surface-2/80 hover:text-foreground border border-border/30'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Conversations List with staggered animation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <LayoutGroup>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {pinnedConversations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 uppercase tracking-widest">
                      Pinned
                    </p>
                    {pinnedConversations.map((conv, index) => (
                      <motion.div key={conv.id} variants={itemVariants} layout layoutId={conv.id}>
                        <ConversationItem
                          conversation={conv}
                          isActive={activeConversation?.id === conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          name={getConversationName(conv)}
                          avatar={getConversationAvatar(conv)}
                          status={getOtherMemberStatus(conv)}
                          formatTime={formatTime}
                          currentUserId={user?.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {otherConversations.length > 0 && (
                  <div>
                    {pinnedConversations.length > 0 && (
                      <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 uppercase tracking-widest">
                        Recent
                      </p>
                    )}
                    {otherConversations.map((conv, index) => (
                      <motion.div key={conv.id} variants={itemVariants} layout layoutId={conv.id}>
                        <ConversationItem
                          conversation={conv}
                          isActive={activeConversation?.id === conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          name={getConversationName(conv)}
                          avatar={getConversationAvatar(conv)}
                          status={getOtherMemberStatus(conv)}
                          formatTime={formatTime}
                          currentUserId={user?.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {filteredConversations.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
                  </p>
                  {conversations.length === 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onNewConversation}
                      className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium"
                    >
                      Start a conversation
                    </motion.button>
                  )}
                </motion.div>
              )}
            </LayoutGroup>
          )}
        </div>
      </motion.aside>

      {/* Profile Hub Modal */}
      <ProfileHub isOpen={showProfileHub} onClose={() => setShowProfileHub(false)} />
    </>
  );
});

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

const ConversationItem = memo(function ConversationItem({ 
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
      whileHover={{ x: 4, backgroundColor: 'hsl(var(--surface-2) / 0.8)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left',
        isActive 
          ? 'bg-surface-2/80 border border-border/30' 
          : 'hover:bg-surface-2/50'
      )}
    >
      {/* Avatar with layoutId for shared transitions */}
      <motion.div 
        className="relative flex-shrink-0"
        layoutId={`avatar-${conversation.id}`}
      >
        {conversation.type === 'channel' ? (
          <div className="w-11 h-11 rounded-lg bg-surface-3/80 flex items-center justify-center text-muted-foreground font-semibold border border-border/30">
            <Hash className="w-5 h-5" />
          </div>
        ) : conversation.type === 'group' ? (
          <div className="w-11 h-11 rounded-lg bg-surface-3/80 flex items-center justify-center border border-border/30">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : avatar ? (
          <img src={avatar} alt={name} className="w-11 h-11 rounded-lg object-cover border border-border/30" />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-surface-3/80 flex items-center justify-center text-muted-foreground font-semibold border border-border/30">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {status && status !== 'offline' && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
              status === 'online' && 'bg-status-online',
              status === 'away' && 'bg-status-away'
            )}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <motion.span 
            layoutId={`name-${conversation.id}`}
            className={cn(
              'font-medium truncate text-sm',
              (conversation.unread_count || 0) > 0 ? 'text-foreground' : 'text-foreground/80'
            )}
          >
            {name}
          </motion.span>
          {conversation.last_message && (
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatTime(conversation.last_message.created_at)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-xs truncate',
            (conversation.unread_count || 0) > 0 ? 'text-foreground/70' : 'text-muted-foreground'
          )}>
            {isFromMe && <span className="text-muted-foreground">You: </span>}
            {conversation.last_message?.content || 'No messages yet'}
          </p>
          
          {(conversation.unread_count || 0) > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center pulse-glow"
            >
              {conversation.unread_count}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
});
