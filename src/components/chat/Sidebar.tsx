import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Plus, X, Home, MessageSquare, Users, Hash, User } from 'lucide-react';
import { Conversation } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LinkUpLogo } from '@/components/LinkUpLogo';
import { ProfileHub } from '@/components/ProfileHub';
import { ConversationSkeleton } from './ConversationSkeleton';

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={cn(
          "h-full bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col z-50",
          "hidden md:flex md:w-80",
          isMobileOpen && "fixed inset-y-0 left-0 flex w-[85vw] max-w-[320px] md:relative md:w-80"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <LinkUpLogo size="sm" />
            <div className="flex items-center gap-1">
              <button
                onClick={onNewConversation}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowProfileHub(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={onMobileClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Search */}
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg text-muted-foreground hover:bg-muted transition-colors border border-border/30"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">Search</span>
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto scrollbar-thin pb-1">
            {filters.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  filter === key
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {loading ? (
            <ConversationSkeleton />
          ) : (
            <>
              {pinnedConversations.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 uppercase tracking-widest">
                    Pinned
                  </p>
                  {pinnedConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
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
                    <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 uppercase tracking-widest">
                      Recent
                    </p>
                  )}
                  {otherConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation?.id === conv.id}
                      onClick={() => handleSelectConversation(conv)}
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
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
                  </p>
                  {conversations.length === 0 && (
                    <button
                      onClick={onNewConversation}
                      className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
                    >
                      Start a conversation
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

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
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
        isActive 
          ? 'bg-muted' 
          : 'hover:bg-muted/50'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {conversation.type === 'channel' ? (
          <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Hash className="w-5 h-5" />
          </div>
        ) : conversation.type === 'group' ? (
          <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : avatar ? (
          <img src={avatar} alt={name} className="w-11 h-11 rounded-lg object-cover" />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {status && status !== 'offline' && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
              status === 'online' && 'bg-green-500',
              status === 'away' && 'bg-yellow-500'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-medium truncate text-sm',
            (conversation.unread_count || 0) > 0 ? 'text-foreground' : 'text-foreground/80'
          )}>
            {name}
          </span>
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
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});
