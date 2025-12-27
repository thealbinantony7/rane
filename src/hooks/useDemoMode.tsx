import { useState, useEffect, useCallback } from 'react';
import { conversations as mockConversations, messagesData, users, currentUser, Message } from '@/lib/mockData';

export interface DemoConversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string;
  avatar_url?: string;
  is_pinned?: boolean;
  is_muted?: boolean;
  unread_count: number;
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
  members?: {
    user_id: string;
    profile: {
      display_name: string;
      username: string;
      avatar_url: string;
      status: 'online' | 'away' | 'offline';
    };
  }[];
}

export interface DemoMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  reactions?: { emoji: string; count: number }[];
}

export function useDemoMode() {
  const [demoConversations, setDemoConversations] = useState<DemoConversation[]>([]);
  const [demoMessages, setDemoMessages] = useState<Record<string, DemoMessage[]>>({});

  useEffect(() => {
    // Convert mock conversations to demo format
    const converted: DemoConversation[] = mockConversations.map(conv => ({
      id: conv.id,
      type: conv.type,
      name: conv.name,
      avatar_url: conv.avatar,
      is_pinned: conv.isPinned,
      is_muted: conv.isMuted,
      unread_count: conv.unreadCount,
      last_message: conv.lastMessage ? {
        content: conv.lastMessage.content,
        sender_id: conv.lastMessage.senderId,
        created_at: conv.lastMessage.timestamp.toISOString(),
      } : undefined,
      members: conv.participants.map(p => ({
        user_id: p.id,
        profile: {
          display_name: p.name,
          username: p.username,
          avatar_url: p.avatar,
          status: p.status,
        },
      })),
    }));
    setDemoConversations(converted);

    // Convert messages
    const convertedMessages: Record<string, DemoMessage[]> = {};
    Object.entries(messagesData).forEach(([convId, msgs]) => {
      convertedMessages[convId] = msgs.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.senderId,
        created_at: msg.timestamp.toISOString(),
        is_read: msg.isRead || false,
        reactions: msg.reactions,
      }));
    });
    setDemoMessages(convertedMessages);
  }, []);

  const getDemoMessages = useCallback((conversationId: string) => {
    return demoMessages[conversationId] || [];
  }, [demoMessages]);

  const sendDemoMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: DemoMessage = {
      id: `demo-${Date.now()}`,
      content,
      sender_id: 'me',
      created_at: new Date().toISOString(),
      is_read: true,
    };

    setDemoMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update last message in conversation
    setDemoConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, last_message: { content, sender_id: 'me', created_at: newMessage.created_at } }
        : conv
    ));

    return newMessage;
  }, []);

  const getDemoUser = useCallback((userId: string) => {
    if (userId === 'me') return currentUser;
    return users.find(u => u.id === userId);
  }, []);

  return {
    demoConversations,
    getDemoMessages,
    sendDemoMessage,
    getDemoUser,
    currentUser,
  };
}
