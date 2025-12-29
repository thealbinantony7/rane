import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Conversation, Message, messagesData, currentUser } from '@/lib/mockData';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { ReplyPreview } from './ReplyPreview';
import { VoiceRecorder } from './VoiceRecorder';
import { MediaUpload } from './MediaUpload';
import { SelfDestructTimer } from './SelfDestructTimer';
import { AISummary } from './AISummary';
import { MessageCircle, Sparkles } from 'lucide-react';

interface ChatViewProps {
  conversation: Conversation | null;
  onToggleInfo: () => void;
}

export function ChatView({ conversation, onToggleInfo }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [selfDestructTimer, setSelfDestructTimer] = useState<number | null>(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      setMessages(messagesData[conversation.id] || []);
      setReplyingTo(null);
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (content: string, options?: { selfDestruct?: number }) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: currentUser.id,
      timestamp: new Date(),
      isRead: false,
      replyTo: replyingTo?.id,
      selfDestruct: options?.selfDestruct,
    };
    setMessages(prev => [...prev, newMessage]);
    setReplyingTo(null);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          return { ...msg, reactions: reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) };
        }
        return { ...msg, reactions: [...reactions, { emoji, count: 1 }] };
      }
      return msg;
    }));
  };

  const handleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isBookmarked: !msg.isBookmarked } : msg
    ));
  };

  const handleVoiceSend = (duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    handleSendMessage(`[Voice message ${mins}:${secs.toString().padStart(2, '0')}]`);
    setShowVoiceRecorder(false);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          >
            <MessageCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Welcome to LINKUP</h2>
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
      <ChatHeader conversation={conversation} onToggleInfo={onToggleInfo} />

      {/* AI Summary Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAISummary(true)}
        className="absolute top-20 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-medium hover:from-primary/30 hover:to-accent/30 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        AI Summary
      </motion.button>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUser.id;
            const prevMessage = messages[index - 1];
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
            const replyToMessage = message.replyTo ? messages.find(m => m.id === message.replyTo) : undefined;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={showAvatar}
                onReply={setReplyingTo}
                onReact={handleReact}
                onBookmark={handleBookmark}
                replyToMessage={replyToMessage}
              />
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && conversation.type === 'direct' && (
            <TypingIndicator userName={conversation.participants[0]?.name || 'Someone'} />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyingTo && <ReplyPreview message={replyingTo} onCancel={() => setReplyingTo(null)} />}
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
      <AISummary isOpen={showAISummary} onClose={() => setShowAISummary(false)} conversationName={conversation.name} />
    </div>
  );
}
