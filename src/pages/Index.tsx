import { useState, useEffect, useMemo, memo } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatViewReal } from '@/components/chat/ChatViewReal';
import { InfoPanel } from '@/components/chat/InfoPanel';
import { CommandPalette } from '@/components/chat/CommandPalette';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { NewConversationModal } from '@/components/chat/NewConversationModal';
import { CallModal } from '@/components/chat/CallModal';
import { MeshBackground } from '@/components/MeshBackground';
import { useConversations, useProfiles, Conversation } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Helmet } from 'react-helmet';

const Index = memo(function Index() {
  const { user } = useAuth();
  const { conversations: dbConversations, loading: conversationsLoading, refetch, createConversation } = useConversations();
  const { profiles } = useProfiles();
  const { demoConversations, getDemoMessages, sendDemoMessage, getDemoUser } = useDemoMode();
  
  const isDemoMode = !conversationsLoading && dbConversations.length === 0;
  
  const conversations: Conversation[] = useMemo(() => {
    if (isDemoMode) {
      return demoConversations.map(dc => ({
        id: dc.id,
        type: dc.type,
        name: dc.name,
        avatar_url: dc.avatar_url,
        is_pinned: dc.is_pinned,
        is_muted: dc.is_muted,
        is_private: false,
        unread_count: dc.unread_count,
        last_message: dc.last_message,
        members: dc.members,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as unknown as Conversation[];
    }
    return dbConversations;
  }, [isDemoMode, demoConversations, dbConversations]);

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [callData, setCallData] = useState<{ type: 'voice' | 'video'; participant: { name: string; avatar: string } } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const updated = conversations.find(c => c.id === activeConversation.id);
      if (updated) {
        setActiveConversation(updated);
      }
    }
  }, [conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectConversationById = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setActiveConversation(conv);
    }
  };

  const handleCreateConversation = async (type: 'direct' | 'group' | 'channel', data: any) => {
    try {
      const conv = await createConversation(type, data);
      if (conv) {
        await refetch();
        const newConv = conversations.find(c => c.id === conv.id);
        if (newConv) {
          setActiveConversation(newConv);
        }
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (activeConversation && activeConversation.type === 'direct' && activeConversation.members) {
      const otherMember = activeConversation.members.find(m => m.user_id !== user?.id);
      if (otherMember?.profile) {
        setCallData({
          type,
          participant: {
            name: otherMember.profile.display_name || otherMember.profile.username || 'Unknown',
            avatar: otherMember.profile.avatar_url || '',
          },
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>LINKUP - Premium Messaging Platform</title>
        <meta name="description" content="LINKUP is a premium, real-time messaging platform with end-to-end encryption, beautiful monochrome design, and powerful features." />
      </Helmet>

      {/* Animated Mesh Background */}
      <MeshBackground />

      <LayoutGroup>
        <div className="h-screen flex overflow-hidden relative">
          {/* Sidebar */}
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
            onOpenSettings={() => setShowSettings(true)}
            onNewConversation={() => setShowNewConversation(true)}
            loading={conversationsLoading}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Chat View with slide transition */}
          <motion.div
            className="flex-1 flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ChatViewReal
              conversation={activeConversation}
              onToggleInfo={() => setShowInfo(!showInfo)}
              onCall={handleCall}
              profiles={profiles}
              isDemoMode={isDemoMode}
              getDemoMessages={getDemoMessages}
              sendDemoMessage={sendDemoMessage}
              getDemoUser={getDemoUser}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />
          </motion.div>

          {/* Info Panel with slide transition */}
          <AnimatePresence>
            {showInfo && activeConversation && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <InfoPanel
                  conversation={{
                    id: activeConversation.id,
                    type: activeConversation.type as 'direct' | 'group' | 'channel',
                    name: activeConversation.name || '',
                    participants: (activeConversation.members || []).map(m => ({
                      id: m.user_id,
                      name: m.profile?.display_name || m.profile?.username || 'Unknown',
                      username: m.profile?.username || '',
                      avatar: m.profile?.avatar_url || '',
                      status: (m.profile?.status as 'online' | 'away' | 'offline') || 'offline',
                    })),
                    unreadCount: activeConversation.unread_count || 0,
                    isPinned: activeConversation.is_pinned,
                    isMuted: activeConversation.is_muted,
                  }}
                  onClose={() => setShowInfo(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Command Palette with blur backdrop */}
          <CommandPalette
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onSelectConversation={handleSelectConversationById}
          />

          {/* Settings Modal */}
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />

          {/* New Conversation Modal */}
          <NewConversationModal
            isOpen={showNewConversation}
            onClose={() => setShowNewConversation(false)}
            onCreate={handleCreateConversation}
          />

          {/* Call Modal */}
          {callData && (
            <CallModal
              isOpen={!!callData}
              onClose={() => setCallData(null)}
              type={callData.type}
              participant={callData.participant}
            />
          )}
        </div>
      </LayoutGroup>
    </>
  );
});

export default Index;
