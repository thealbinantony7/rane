import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatView } from '@/components/chat/ChatView';
import { InfoPanel } from '@/components/chat/InfoPanel';
import { CommandPalette } from '@/components/chat/CommandPalette';
import { Conversation, conversations } from '@/lib/mockData';
import { Helmet } from 'react-helmet';

const Index = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleSelectConversationById = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setActiveConversation(conv);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nova - Next Generation Messaging</title>
        <meta name="description" content="A premium, real-time messaging platform with end-to-end encryption, beautiful design, and powerful features." />
      </Helmet>

      <div className="h-screen flex overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />

        {/* Main Chat View */}
        <ChatView
          conversation={activeConversation}
          onToggleInfo={() => setShowInfo(!showInfo)}
        />

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && activeConversation && (
            <InfoPanel
              conversation={activeConversation}
              onClose={() => setShowInfo(false)}
            />
          )}
        </AnimatePresence>

        {/* Command Palette */}
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onSelectConversation={handleSelectConversationById}
        />
      </div>
    </>
  );
};

export default Index;
