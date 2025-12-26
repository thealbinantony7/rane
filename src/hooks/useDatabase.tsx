import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  status: string | null;
  last_seen: string | null;
}

export interface Conversation {
  id: string;
  type: string;
  name: string | null;
  avatar_url: string | null;
  is_private: boolean | null;
  created_at: string;
  members?: ConversationMember[];
  last_message?: Message | null;
  unread_count?: number;
  is_pinned?: boolean;
  is_muted?: boolean;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  is_muted: boolean;
  is_pinned: boolean;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  reply_to: string | null;
  is_read: boolean;
  is_bookmarked: boolean;
  self_destruct_seconds: number | null;
  created_at: string;
  sender?: Profile;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all conversation IDs the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('conversation_members')
        .select('conversation_id, is_pinned, is_muted')
        .eq('user_id', user.id);

      if (memberError) throw memberError;
      if (!memberData || memberData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = memberData.map(m => m.conversation_id);

      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds);

      if (convError) throw convError;

      // Get members for each conversation
      const { data: allMembers, error: allMembersError } = await supabase
        .from('conversation_members')
        .select('*')
        .in('conversation_id', conversationIds);

      if (allMembersError) throw allMembersError;

      // Get profiles for members
      const memberUserIds = [...new Set((allMembers || []).map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', memberUserIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      // Build conversations with details
      const conversationsWithDetails: Conversation[] = await Promise.all(
        (convData || []).map(async (conv) => {
          // Get last message
          const { data: lastMsgData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          let lastMessage: Message | null = null;
          if (lastMsgData) {
            lastMessage = {
              ...lastMsgData,
              sender: profileMap.get(lastMsgData.sender_id) || undefined,
            };
          }

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          const members: ConversationMember[] = (allMembers || [])
            .filter(m => m.conversation_id === conv.id)
            .map(m => ({
              ...m,
              profile: profileMap.get(m.user_id),
            }));

          const memberInfo = memberData.find(m => m.conversation_id === conv.id);

          return {
            ...conv,
            members,
            last_message: lastMessage,
            unread_count: unreadCount || 0,
            is_pinned: memberInfo?.is_pinned || false,
            is_muted: memberInfo?.is_muted || false,
          };
        })
      );

      // Sort by pinned first, then by last message time
      conversationsWithDetails.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        const aTime = a.last_message?.created_at || a.created_at;
        const bTime = b.last_message?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (type: string, data: { name?: string; userIds?: string[] }) => {
    if (!user) return null;

    try {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({
          type,
          name: data.name || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      await supabase
        .from('conversation_members')
        .insert({
          conversation_id: conv.id,
          user_id: user.id,
          role: 'owner',
        });

      if (data.userIds) {
        await supabase
          .from('conversation_members')
          .insert(
            data.userIds.map(userId => ({
              conversation_id: conv.id,
              user_id: userId,
              role: 'member',
            }))
          );
      }

      await fetchConversations();
      return conv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  return { conversations, loading, refetch: fetchConversations, createConversation };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      const unsubscribe = subscribeToMessages();
      return unsubscribe;
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      const senderIds = [...new Set((msgData || []).map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', senderIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      const messageIds = (msgData || []).map(m => m.id);
      const { data: reactions } = await supabase
        .from('message_reactions')
        .select('*')
        .in('message_id', messageIds);

      const reactionsMap = new Map<string, MessageReaction[]>();
      (reactions || []).forEach(r => {
        const existing = reactionsMap.get(r.message_id) || [];
        reactionsMap.set(r.message_id, [...existing, r]);
      });

      const messagesWithDetails: Message[] = (msgData || []).map(msg => ({
        ...msg,
        sender: profileMap.get(msg.sender_id),
        reactions: reactionsMap.get(msg.id) || [],
      }));

      setMessages(messagesWithDetails);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string, options?: { replyTo?: string; selfDestruct?: number }) => {
    if (!conversationId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          reply_to: options?.replyTo || null,
          self_destruct_seconds: options?.selfDestruct || null,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        });

      if (error && !error.message.includes('duplicate')) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const toggleBookmark = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_bookmarked: !message.is_bookmarked })
        .eq('id', messageId);

      if (error) throw error;
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, is_bookmarked: !msg.is_bookmarked } : msg))
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return { messages, loading, sendMessage, addReaction, toggleBookmark, refetch: fetchMessages };
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return { profiles, loading, refetch: fetchProfiles };
}
