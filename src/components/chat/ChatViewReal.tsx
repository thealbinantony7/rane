import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Conversation, Message, Profile, useMessages } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { ReplyPreview } from './ReplyPreview';
import { VoiceRecorder } from './VoiceRecorder';
import { MediaUpload } from './MediaUpload';
import { SelfDestructTimer } from './SelfDestructTimer';
import { AISummary } from './AISummary';
import { InChatSearch } from './InChatSearch';
import { MessageCircle, Sparkles } from 'lucide-react';
import { RaneLogo } from '@/components/RaneLogo';
import { DemoMessage } from '@/hooks/useDemoMode';
import { User } from '@/lib/mockData';

interface ChatViewRealProps {
  conversation: Conversation | null;
  onToggleInfo: () => void;
  onCall: (type: 'voice' | 'video') => void;
  profiles: Profile[];
  isDemoMode?: boolean;
  getDemoMessages?: (conversationId: string) => DemoMessage[];
  sendDemoMessage?: (conversationId: string, content: string) => DemoMessage;
  getDemoUser?: (userId: string) => User | undefined;
}

export function ChatViewReal({ 
  conversation, 
  onToggleInfo, 
  onCall, 
  profiles,
  isDemoMode = false,
  getDemoMessages,
  sendDemoMessage: sendDemoMsg,
  getDemoUser,
}: ChatViewRealProps) {
  const { user } = useAuth();
  const { messages: dbMessages, loading: dbLoading, sendMessage: dbSendMessage, addReaction, toggleBookmark } = useMessages(conversation?.id || null);
  
  // Use demo messages if in demo mode
  const demoMessages = isDemoMode && getDemoMessages && conversation ? getDemoMessages(conversation.id) : [];
  const messages = isDemoMode ? demoMessages.map(dm => ({
    id: dm.id,
    content: dm.content,
    sender_id: dm.sender_id,
    created_at: dm.created_at,
    is_read: dm.is_read,
    is_bookmarked: false,
    self_destruct_seconds: null,
    reactions: dm.reactions?.map(r => ({ emoji: r.emoji, user_id: 'me' })) || [],
    sender: getDemoUser ? getDemoUser(dm.sender_id) : undefined,
  })) : dbMessages;
  
  const loading = isDemoMode ? false : dbLoading;
  
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [selfDestructTimer, setSelfDestructTimer] = useState<number | null>(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setReplyingTo(null);
    setShowSearch(false);
  }, [conversation?.id]);

  const handleSendMessage = async (content: string, options?: { selfDestruct?: number }) => {
    if (isDemoMode && sendDemoMsg && conversation) {
      sendDemoMsg(conversation.id, content);
      setReplyingTo(null);
      return;
    }
    try {
      await dbSendMessage(content, { 
        replyTo: replyingTo?.id, 
        selfDestruct: options?.selfDestruct || selfDestructTimer || undefined 
      });
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!isDemoMode) {
      addReaction(messageId, emoji);
    }
  };

  const handleBookmark = (messageId: string) => {
    if (!isDemoMode) {
      toggleBookmark(messageId);
    }
  };

  const handleVoiceSend = (duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    handleSendMessage(`[Voice message ${mins}:${secs.toString().padStart(2, '0')}]`);
    setShowVoiceRecorder(false);
  };

  const getConversationName = () => {
    if (conversation?.name) return conversation.name;
    if (conversation?.type === 'direct' && conversation.members) {
      const otherMember = conversation.members.find(m => m.user_id !== user?.id);
      return otherMember?.profile?.display_name || otherMember?.profile?.username || 'Unknown';
    }
    return 'Unnamed';
  };

  const handleNavigateToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            className="mb-6 flex justify-center"
          >
            <RaneLogo size="xl" showText={false} />
          </motion.div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Welcome to Rane</h2>
          <p className="text-muted-foreground max-w-sm">Select a conversation to start messaging.</p>
          <p className="text-sm text-muted-foreground/60 mt-4">
            Press <kbd className="px-2 py-1 rounded bg-surface-2 font-mono text-xs">⌘K</kbd> to search
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0 relative">
      <ChatHeader 
        conversation={{
          id: conversation.id,
          type: conversation.type as 'direct' | 'group' | 'channel',
          name: getConversationName(),
          participants: (conversation.members || []).map(m => ({
            id: m.user_id,
            name: m.profile?.display_name || m.profile?.username || 'Unknown',
            username: m.profile?.username || '',
            avatar: m.profile?.avatar_url || '',
            status: (m.profile?.status as 'online' | 'away' | 'offline') || 'offline',
            lastSeen: m.profile?.last_seen || undefined,
          })),
          unreadCount: 0,
        }}
        onToggleInfo={onToggleInfo}
      />

      {/* In-Chat Search */}
      <InChatSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        messages={messages.map(m => ({
          ...m,
          timestamp: new Date(m.created_at),
        })) as any}
        onNavigateToMessage={handleNavigateToMessage}
      />

      {/* AI Summary Button */}
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowAISummary(true)}
        className="absolute top-20 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full liquid-glass text-foreground text-sm font-medium hover-lift press-effect"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        AI Summary
      </motion.button>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Send the first message!</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message: any, index: number) => {
              const isOwnMessage = isDemoMode ? message.sender_id === 'me' : message.sender_id === user?.id;
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage || (prevMessage as any).sender_id !== message.sender_id;
              const replyToMessage = message.reply_to ? messages.find((m: any) => m.id === message.reply_to) : undefined;

              const sender = message.sender || profiles.find(p => p.id === message.sender_id) || (isDemoMode && getDemoUser ? getDemoUser(message.sender_id) : undefined);

              return (
                <div key={message.id} id={`message-${message.id}`}>
                  <MessageBubble
                    message={{
                      id: message.id,
                      content: message.content,
                      senderId: message.sender_id,
                      timestamp: new Date(message.created_at),
                      isRead: message.is_read,
                      isBookmarked: message.is_bookmarked,
                      selfDestruct: message.self_destruct_seconds || undefined,
                      reactions: aggregateReactions(message.reactions || []),
                    }}
                    isOwnMessage={isOwnMessage}
                    showAvatar={showAvatar}
                    onReply={() => setReplyingTo(message)}
                    onReact={(msgId, emoji) => handleReact(msgId, emoji)}
                    onBookmark={(msgId) => handleBookmark(msgId)}
                    replyToMessage={replyToMessage ? {
                      id: replyToMessage.id,
                      content: replyToMessage.content,
                      senderId: replyToMessage.sender_id,
                      timestamp: new Date(replyToMessage.created_at),
                    } : undefined}
                  />
                </div>
              );
            })}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyingTo && (
          <ReplyPreview 
            message={{
              id: replyingTo.id,
              content: replyingTo.content,
              senderId: replyingTo.sender_id,
              timestamp: new Date(replyingTo.created_at),
            }} 
            onCancel={() => setReplyingTo(null)} 
          />
        )}
      </AnimatePresence>

      {/* Voice Recorder */}
      <VoiceRecorder isOpen={showVoiceRecorder} onClose={() => setShowVoiceRecorder(false)} onSend={handleVoiceSend} />

      {/* Message Input */}
      {!showVoiceRecorder && (
        <MessageInput
          onSendMessage={handleSendMessage}
          onStartVoiceRecording={() => setShowVoiceRecorder(true)}
          onOpenMediaUpload={() => setShowMediaUpload(true)}
          selfDestructTimer={selfDestructTimer}
          onOpenTimerSettings={() => setShowTimerSettings(true)}
        />
      )}

      {/* Modals */}
      <MediaUpload isOpen={showMediaUpload} onClose={() => setShowMediaUpload(false)} onUpload={(files) => handleSendMessage(`[Attached ${files.length} file(s)]`)} />
      <SelfDestructTimer isOpen={showTimerSettings} onClose={() => setShowTimerSettings(false)} onSelect={setSelfDestructTimer} currentTimer={selfDestructTimer} />
      <AISummary 
        isOpen={showAISummary} 
        onClose={() => setShowAISummary(false)} 
        conversationName={getConversationName()}
        messages={messages.map(m => {
          const sender = m.sender || profiles.find(p => p.id === m.sender_id);
          return {
            id: m.id,
            content: m.content,
            sender_id: m.sender_id,
            sender_name: sender?.display_name || sender?.username || 'User',
            created_at: m.created_at,
          };
        })}
      />
    </div>
  );
}

function aggregateReactions(reactions: { emoji: string; user_id: string }[]): { emoji: string; count: number }[] {
  const counts = new Map<string, number>();
  reactions.forEach(r => {
    counts.set(r.emoji, (counts.get(r.emoji) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([emoji, count]) => ({ emoji, count }));
}
